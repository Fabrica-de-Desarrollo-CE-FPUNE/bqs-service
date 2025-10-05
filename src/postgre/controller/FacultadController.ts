import { FindOptionsWhere, Repository } from "typeorm";
import { Facultad } from "../entity/Facultad";
import { EntityControllerInterface } from "./EntityControllerInterface";
import { AppDataSource } from "../data-source";
import logger from "../../log/logger";

export class FacultadController implements EntityControllerInterface<Facultad> {
    
    private facultadRepositorio: Repository<Facultad>;

    constructor(tx = AppDataSource) {
        this.facultadRepositorio = tx.getRepository(Facultad);
    }
    
    gestionar =  async (facultad: Facultad) => {
        return await this.get(facultad).then(async value => {
            if(!value){
                return this.setOrUpdate(facultad);
            }
        });
    }
    
    get = async (data: Facultad) => {
        const where = data as unknown as FindOptionsWhere<Facultad>;
        return await this.facultadRepositorio.findOne({
            where
        }).then(value=>{
            if(!value){
                logger.warn(`No se encontró la facultad ${where.nombre}`);
            }
            return value;
        });
    };

    setOrUpdate = async (data: Facultad) => {
        if(data.id){
            logger.debug(`Intentando actualizar facultad ${data.nombre} con ID ${data.id}`);
        } else {
            logger.debug(`Intentando agregar facultad ${data.nombre}`);
        }
        return await this.facultadRepositorio.save(data).then(value => {
            logger.info(`Guardando facultad con id ${value.id}`);
            return value;
        })
    };

    getAll = async (data?: Facultad) => {
        const where = data as unknown as FindOptionsWhere<Facultad>;
        return await this.facultadRepositorio.find({
            where
        }).then(value=>{
            if(!value.length){
                logger.warn(`No se encontró la carreras con los datos requeridos.`);
            } else {
                logger.info(`Se encontraron ${value.length} carreras.`);
            }
            return value;
        });
    }
}