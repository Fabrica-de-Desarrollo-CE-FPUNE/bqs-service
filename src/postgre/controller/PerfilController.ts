import { Repository } from "typeorm";
import { Perfil } from "../entity/Perfil";
import { AppDataSource } from "../data-source";
import logger from "../../log/logger";
import { Usuario } from "../entity/Usuario";
import { vista_info_consultor } from "../../types/ConsultorEstudianteVistas.types";

export class PerfilController {
    
    private perfilRepositorio: Repository<Perfil>;

    constructor() {
        this.perfilRepositorio = AppDataSource.getRepository(Perfil);
    }

    public async getPerfil(cedulaIdentidad: string) {
        return await this.perfilRepositorio.findOne({
            where:{
                cedulaIdentidad
            }
        })
    }

    public async gestionarPerfil(usuario: Usuario, vista_info_consultor: vista_info_consultor) {
        return await this.perfilRepositorio.findOne({
            where: { cedulaIdentidad: usuario.cedula }
        }).then(async (value) => {
            if (!value) {
                logger.warn(`No se encontró el perfil con CI ${usuario.cedula}, intentando crear uno nuevo`);
                const perfil = new Perfil({ vista_info_consultor });
                perfil.usuario = usuario;
                return await this.perfilRepositorio.save(perfil).then(value => {
                    logger.info(`Guardando perfil con id ${value.id}`);
                    return value;
                });
            }
            return value;
        });
    }
}
