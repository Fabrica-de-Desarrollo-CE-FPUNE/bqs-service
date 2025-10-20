import { EntityManager, FindOptionsWhere } from "typeorm";
import { Materia } from "../entity/Materia";
import { AppDataSource } from "../data-source";
import logger from "../../log/logger";
import { EntityControllerInterface } from "./EntityControllerInterface";

export class MateriaController implements EntityControllerInterface<Materia> {
    
    private manager: EntityManager;

    constructor(tx: EntityManager = AppDataSource.manager) {
        this.manager = tx;
    }
    
    public gestionar = async (data: Materia): Promise<Materia> => {
        const where = { nombre: data.nombre };
        const materiaExistente = await this.get(where);

        if (materiaExistente) {
            return materiaExistente;
        }

        return this.setOrUpdate(data);
    };

    public get = async (where: FindOptionsWhere<Materia>): Promise<Materia | null> => {
        const materia = await this.manager.findOne(Materia, { where });

        if (!materia) {
            logger.warn(`No se encontró la materia.`);
        }
        
        return materia;
    }

    public getAll = async (where?: FindOptionsWhere<Materia>): Promise<Materia[]> => {
        const materias = await this.manager.find(Materia, { where });

        if (!materias.length) {
            logger.warn(`No se encontraron las materias con los datos requeridos.`);
        } else {
            logger.info(`Se encontraron ${materias.length} materias.`);
        }
        
        return materias;
    };

    public setOrUpdate = async (data: Materia): Promise<Materia> => {
        if (data.id) {
            logger.debug(`Intentando actualizar materia ${data.nombre} con ID ${data.id}`);
        } else {
            logger.debug(`Intentando agregar materia ${data.nombre}`);
        }

        const materiaGuardada = await this.manager.save(Materia, data);
        logger.info(`Guardando materia con id ${materiaGuardada.id}`);

        return materiaGuardada;
    }
}