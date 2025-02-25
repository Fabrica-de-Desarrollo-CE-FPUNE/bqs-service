import { FindOptionsWhere, Repository } from "typeorm";
import { Materia } from "../entity/Materia";
import { AppDataSource } from "../data-source";
import logger from "../../log/logger";
import { EntityControllerInterface } from "./EntityControllerInterface";

export class MateriaController implements EntityControllerInterface<Materia>{
    
    private materiaRepositorio: Repository<Materia>;

    constructor() {
        this.materiaRepositorio = AppDataSource.getRepository(Materia);
    }
    gestionar = async (data: Materia) => {
        return await this.get(data).then(async value => {
            if(!value){
                return await this.setOrUpdate(data);
            }
            return value;
        })
    };
    get = async (data: Materia) => {
        const {nombre} = data as unknown as FindOptionsWhere<Materia>;
        return this.materiaRepositorio.findOne({
            where: {
                nombre
            }
        }).then(value => {
            if(!value){
                logger.warn(`No se encontró la materia ${nombre}.`);
            }
            return value;
        })
    }
    getAll = async (data?: Materia ) => {
        const where = data as unknown as FindOptionsWhere<Materia>;
        return this.materiaRepositorio.find({
            where
        }).then(value => {
            if(!value.length){
                logger.warn(`No se encontró las materias con los datos requeridos.`);
            } else {
                logger.info(`Se encontraron ${value.length} materias.`);
            }
            return value;
        })
    };
    setOrUpdate = async (data: Materia) => {
        if(data.id){
            logger.debug(`Intentando actualizar materia ${data.nombre} con ID ${data.id}`);
        } else {
            logger.debug(`Intentando agregar materia ${data.nombre}`);
        }

        return this.materiaRepositorio.save(data).then(value => {
            logger.info(`Guardando materia con id ${value.id}`);
            return value;
        });
    }

   
}
