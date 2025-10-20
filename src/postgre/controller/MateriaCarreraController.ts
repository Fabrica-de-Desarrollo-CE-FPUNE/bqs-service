import { FindOptionsWhere, Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { MateriaCarrera } from '../entity/MateriaCarrera';
import { EntityControllerInterface } from './EntityControllerInterface';
import logger from '../../log/logger';

export class MateriaCarreraController implements EntityControllerInterface<MateriaCarrera> {

    private materiaCarreraRepositorio: Repository<MateriaCarrera>;

    constructor() {
        this.materiaCarreraRepositorio =  AppDataSource.getRepository(MateriaCarrera);
    }


    gestionar =  async (data: MateriaCarrera) => {
        return await this.get(data).then(async value => {
            if(!value){
                return this.setOrUpdate(data);
            }
            return value;
        });
    }
    
    get = async (data: MateriaCarrera) => {
        const where = data as unknown as FindOptionsWhere<MateriaCarrera>;
        return await this.materiaCarreraRepositorio.findOne({
            where
        }).then(value=>{
            if(!value){
                logger.warn(`No se encontró la union entre la carrera y la materia`);
            }
            return value;
        });
    };

    setOrUpdate = async (data: MateriaCarrera) => {
        if(data.id){
            logger.debug(`Intentando actualizar materiacarrera con ID ${data.id}`);
        } else {
            logger.debug(`Intentando agregar materiacarrera`);
        }
        return await this.materiaCarreraRepositorio.save(data).then(value => {
            logger.info(`Guardando materiacarrera con id ${value.id}`);
            return value;
        })
    };

    getAll = async (data?: MateriaCarrera) => {
        const where = data as unknown as FindOptionsWhere<MateriaCarrera>;
        return await this.materiaCarreraRepositorio.find({
            where
        }).then(value=>{
            if(!value.length){
                logger.warn(`No se encontró las uniones con los datos requeridos.`);
            } else {
                logger.info(`Se encontraron ${value.length} materiacarreras.`);
            }
            return value;
        });
    }
}