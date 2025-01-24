import { Repository } from "typeorm";
import { Usuario } from "../entity/Usuario";
import { AppDataSource } from "../data-source";
import logger from "../../log/logger";
import { Alumno_credencial_login } from "../../types/ConsultorEstudianteCredenciales.types";

export class UsuarioController {
    private usuarioRepositorio: Repository<Usuario>;

    constructor() {
        this.usuarioRepositorio = AppDataSource.getRepository(Usuario);
    }

    public async getUsuario (cedula:string) {
        logger.debug(`buscando usuario con cedula ${cedula}`)
        return await this.usuarioRepositorio.findOne({
            where: {
                cedula
            }
        }).then((value)=>{
            if(!value){
                logger.warn('no se encontró al usuario')
                return;
            }
            logger.info(`usuario encontrado id ${value.id}`);
            return value;
        })
    }

    public async addUsuario (cedula:string, contrasenia:string) {
        logger.debug(`intentando agregar usuario con cedula ${cedula}`)
        const nuevoUsuario = new Usuario();
        await nuevoUsuario.init({cedula, contrasenia});
        logger.info(`la contra hasheada es ${nuevoUsuario.password}`)
        return await this.usuarioRepositorio.save(nuevoUsuario);
    }

    public async gestionarUsuario(credencial: Alumno_credencial_login) {
        return await this.usuarioRepositorio.findOne({
            where: {
                cedula: credencial.cedula
            }
        }).then(async value => {
            if (!value) {
                logger.warn(`No se encontró el usuario con cédula ${credencial.cedula}, intentando crear uno`);
                return await this.usuarioRepositorio.save(new Usuario(credencial)).then(value => {
                    logger.info(`Guardando usuario con id ${value.id}`);
                    return value;
                });
            }
            return value;
        });
    }
}
