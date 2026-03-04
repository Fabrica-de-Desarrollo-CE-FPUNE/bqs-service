import { EntityManager } from "typeorm";
import { ConsultorDataService2 } from "../../core/ConsultorService2";
import logger from "../../log/logger";
import { AlumnoController } from "../../postgre/controller/AlumnoController";
import { UsuarioController } from "../../postgre/controller/UsuarioController";
import { AppDataSource } from "../../postgre/data-source";
import { Usuario } from "../../postgre/entity/Usuario";
import { Alumno_credencial_login } from "../../types/ConsultorEstudianteCredenciales.types";
import { decrypt } from "../../utils/crypto";
import { EstudianteError } from "../errors/EstudianteError";

export const authService = async (credenciales: Alumno_credencial_login) => {
    const data = await AppDataSource.transaction(async tx => {
        const usuarioController = new UsuarioController(tx);

        const usuarioTemp = new Usuario();
        usuarioTemp.cedula = credenciales.cedula;
        let usuario = await usuarioController.get(usuarioTemp);

        if (!usuario) {
            usuario = await setOrUpdateUsuario(credenciales, tx);
        } else if (!(credenciales.contrasenia === decrypt(usuario.password))) {
            throw EstudianteError.Unauthorized()
        }

        if (!usuario) {
            throw EstudianteError.NoDataFound();
        }

        logger.debug('creando token y enviando al usuario')
        return usuario;
    });
    return data;
}

export const setOrUpdateUsuario = async (credenciales: Alumno_credencial_login, tx: EntityManager = AppDataSource.manager) => {
    const usuarioController = new UsuarioController(tx);
    const alumnoController = new AlumnoController(tx);
    const usuarioTemp = new Usuario();
    usuarioTemp.cedula = credenciales.cedula;
    let usuario = await usuarioController.get(usuarioTemp);
    logger.debug('calling the core service for consultor data');
    const consultor_servicio: ConsultorDataService2 = new ConsultorDataService2();
    const estudiante_data = await consultor_servicio.getAll_Consultor_Info(credenciales);
    await usuarioTemp.init(credenciales);
    const usuarioData = await usuarioController.setOrUpdate(usuarioTemp);
    await alumnoController.guardarAlumnoData(usuarioData, estudiante_data);
    return usuarioData;
}