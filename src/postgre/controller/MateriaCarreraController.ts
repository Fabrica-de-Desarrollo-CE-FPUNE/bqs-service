import { EntityManager, FindOptionsWhere } from 'typeorm';
import { AppDataSource } from '../data-source';
import { MateriaCarrera } from '../entity/MateriaCarrera';
import { EntityControllerInterface } from './EntityControllerInterface';
import logger from '../../log/logger';

export class MateriaCarreraController implements EntityControllerInterface<MateriaCarrera> {

    private manager: EntityManager;

    constructor(tx: EntityManager = AppDataSource.manager) {
        this.manager = tx;
    }

    public gestionar = async (data: MateriaCarrera): Promise<MateriaCarrera> => {
        const where = {
            materia: data.materia,
            carrera: data.carrera
        };
        const materiaCarreraExistente = await this.get(where);

        if (materiaCarreraExistente) {
            return materiaCarreraExistente;
        }

        return this.setOrUpdate(data);
    }
    
    public get = async (where: FindOptionsWhere<MateriaCarrera>): Promise<MateriaCarrera | null> => {
        const materiaCarrera = await this.manager.findOne(MateriaCarrera, { where });

        if (!materiaCarrera) {
            logger.warn(`No se encontró la union entre la carrera y la materia.`);
        }
        
        return materiaCarrera;
    };

    public setOrUpdate = async (data: MateriaCarrera): Promise<MateriaCarrera> => {
        if (data.id) {
            logger.debug(`Intentando actualizar materiacarrera con ID ${data.id}`);
        } else {
            logger.debug(`Intentando agregar materiacarrera`);
        }
        
        const materiaCarreraGuardada = await this.manager.save(MateriaCarrera, data);
        logger.info(`Guardando materiacarrera con id ${materiaCarreraGuardada.id}`);
        
        return materiaCarreraGuardada;
    };

    public getAll = async (where?: FindOptionsWhere<MateriaCarrera>): Promise<MateriaCarrera[]> => {
        const materiasCarreras = await this.manager.find(MateriaCarrera, { where });

        if (!materiasCarreras.length) {
            logger.warn(`No se encontraron las uniones con los datos requeridos.`);
        } else {
            logger.info(`Se encontraron ${materiasCarreras.length} materiacarreras.`);
        }
        
        return materiasCarreras;
    }
}