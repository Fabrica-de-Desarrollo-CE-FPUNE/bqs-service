import { EntityManager, FindOptionsWhere } from "typeorm";
import { Perfil } from "../entity/Perfil";
import { AppDataSource } from "../data-source";
import logger from "../../log/logger";
import { EntityControllerInterface } from "./EntityControllerInterface";
import { Usuario } from "../entity/Usuario";

export class PerfilController implements EntityControllerInterface<Perfil> {
    
    private manager: EntityManager;

    constructor(tx: EntityManager = AppDataSource.manager) {
        this.manager = tx;
    }
    
    public gestionar = async (data: Perfil): Promise<Perfil> => {
        const where:FindOptionsWhere<Perfil> = { cedula_de_identidad: data.cedula_de_identidad };
        const perfilExistente = await this.get(where);

        if (perfilExistente) {
            return perfilExistente;
        }

        return this.setOrUpdate(data);
    }

    public get = async (where: FindOptionsWhere<Perfil>): Promise<Perfil | null> => {
        const perfil = await this.manager.findOne(Perfil, { where });

        if (!perfil) {
            logger.warn(`No se encontró el perfil.`);
        }
        
        return perfil;
    }

    public getByUsuario= async (usuario:Usuario) => {
        return await this.manager.findOne(Perfil, {
            where: {
                usuario: {
                    id: usuario.id
                }
            }
        })
    }

    public getAll = async (where?: FindOptionsWhere<Perfil>): Promise<Perfil[]> => {
        const perfiles = await this.manager.find(Perfil, { where });

        if (!perfiles.length) {
            logger.warn(`No se encontraron los perfiles con los datos requeridos.`);
        } else {
            logger.info(`Se encontraron ${perfiles.length} perfiles.`);
        }

        return perfiles;
    };

    public setOrUpdate = async (data: Perfil): Promise<Perfil> => {
        if (data.id) {
            logger.debug(`Intentando actualizar perfil ${data.nombre} con ID ${data.id}`);
        } else {
            logger.debug(`Intentando agregar perfil ${data.nombre}`);
        }

        const perfilGuardado = await this.manager.save(Perfil, data);
        logger.info(`Guardando perfil con id ${perfilGuardado.id}`);

        return perfilGuardado;
    }
}