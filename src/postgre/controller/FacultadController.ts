import { EntityManager, FindOptionsWhere } from "typeorm";
import { Facultad } from "../entity/Facultad";
import { EntityControllerInterface } from "./EntityControllerInterface";
import { AppDataSource } from "../data-source";
import logger from "../../log/logger";

export class FacultadController implements EntityControllerInterface<Facultad> {
    
    private manager: EntityManager;

    constructor(tx: EntityManager = AppDataSource.manager) {
        this.manager = tx;
    }
    
    public gestionar = async (facultad: Facultad): Promise<Facultad> => {
        const where = { nombre: facultad.nombre };
        const facultadExistente = await this.get(where);

        if (facultadExistente) {
            return facultadExistente;
        }

        return this.setOrUpdate(facultad);
    }
    
    public get = async (where: FindOptionsWhere<Facultad>): Promise<Facultad | null> => {
        const facultad = await this.manager.findOne(Facultad, { where });

        if (!facultad) {
            logger.warn(`No se encontró la facultad.`);
        }
        
        return facultad;
    };

    public setOrUpdate = async (data: Facultad): Promise<Facultad> => {
        if (data.id) {
            logger.debug(`Intentando actualizar facultad ${data.nombre} con ID ${data.id}`);
        } else {
            logger.debug(`Intentando agregar facultad ${data.nombre}`);
        }

        const facultadGuardada = await this.manager.save(Facultad, data);
        logger.info(`Guardando facultad con id ${facultadGuardada.id}`);
        
        return facultadGuardada;
    };

    public getAll = async (where?: FindOptionsWhere<Facultad>): Promise<Facultad[]> => {
        const facultades = await this.manager.find(Facultad, { where });

        if (!facultades.length) {
            logger.warn(`No se encontraron facultades con los datos requeridos.`);
        } else {
            logger.info(`Se encontraron ${facultades.length} facultades.`);
        }
        
        return facultades;
    }
}