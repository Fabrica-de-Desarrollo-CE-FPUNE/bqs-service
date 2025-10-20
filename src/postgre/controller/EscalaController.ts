import { FindOptionsWhere, Repository } from "typeorm";
import { Escala } from "../entity/Escala";
import { AppDataSource } from "../data-source";
import logger from "../../log/logger";
import { EntityControllerInterface } from "./EntityControllerInterface";

export class EscalaController implements EntityControllerInterface<Escala> {

    private escalaRepositorio: Repository<Escala>;

    constructor() {
        this.escalaRepositorio = AppDataSource.getRepository(Escala);
    }

    gestionar = async (data: Escala) => {
        return await this.get(data).then(async value => {
            if(!value){
                return await this.setOrUpdate(data).then(value => {    
                    return value;
                });
            }
            return value;
        });
    }

    get = async (data: Escala) => {
        const {nombre} = data as unknown as FindOptionsWhere<Escala>;
        logger.debug(`Buscando escala.`);
        return await this.escalaRepositorio.findOne({
            where: {nombre}
        }).then(value => {
            if(!value){
                logger.warn(`No se encontró la escala con estructura ${data.nombre}.`);
            }
            return value;
        });
    }

    getAll = async (data?: Escala) => {
        const where = data as unknown as FindOptionsWhere<Escala>;
        logger.debug(`Buscando escalas.`);
        return await this.escalaRepositorio.find({
            where
        }).then(value => {
            if(!value.length){
                logger.warn(`No se encontró ninguna escala con los datos requeridos.`);
            } else {
                logger.info(`Se encontraron ${value.length} escalas.`);
            }
            return value;
        });

    }

    setOrUpdate = async (data: Escala) => {
        if(data.id){
            logger.debug(`Intentando actualizar la escala con ${data.id}`);
        } else {
            logger.debug(`Intentando agregar la escala ${data.nombre}`);
        }
        return await this.escalaRepositorio.save(data).then(value =>{
            logger.info(`Guardando escala con id ${value.id}`);
            return value;
        });
    }

}
