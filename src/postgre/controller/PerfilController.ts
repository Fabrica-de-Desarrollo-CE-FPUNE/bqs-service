import { FindOptionsWhere, Repository } from "typeorm";
import { Perfil } from "../entity/Perfil";
import { AppDataSource } from "../data-source";
import logger from "../../log/logger";
import { EntityControllerInterface } from "./EntityControllerInterface";

export class PerfilController implements EntityControllerInterface<Perfil> {
    
    private perfilRepositorio: Repository<Perfil>;

    constructor(tx = AppDataSource) {
        this.perfilRepositorio = tx.getRepository(Perfil);
    }
    
    gestionar = async (data: Perfil) => {
            return await this.get(data).then(async value => {
                if(!value){
                    return await this.setOrUpdate(data);
                }
                return value;
            })
        }

    get = async (data: Perfil) => {
        const where = data as unknown as FindOptionsWhere<Perfil>;
        return this.perfilRepositorio.findOne({
            where
        }).then(value => {
            if(!value){
                logger.warn(`No se encontró el perfil ${where.nombre}.`);
            }
            return value;
        })
    }
    getAll = async (data?: Perfil ) => {
        const where = data as unknown as FindOptionsWhere<Perfil>;
        return this.perfilRepositorio.find({
            where
        }).then(value => {
            if(!value.length){
                logger.warn(`No se encontró los perfiles con los datos requeridos.`);
            } else {
                logger.info(`Se encontraron ${value.length} perfiles.`);
            }
            return value;
        })
    };
    setOrUpdate = async (data: Perfil) => {
        if(data.id){
            logger.debug(`Intentando actualizar perfil ${data.nombre} con ID ${data.id}`);
        } else {
            logger.debug(`Intentando agregar perfil ${data.nombre}`);
        }

        return this.perfilRepositorio.save(data).then(value => {
            logger.info(`Guardando perfil con id ${value.id}`);
            return value;
        });
    }
}
