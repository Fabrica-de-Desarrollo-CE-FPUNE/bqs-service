import { EntityManager, FindOptionsWhere } from "typeorm";
import { Carrera } from "../entity/Carrera";
import { AppDataSource } from "../data-source";
import { EntityControllerInterface } from "./EntityControllerInterface";
import logger from "../../log/logger";


export class CarreraController implements EntityControllerInterface<Carrera> {
    
    private manager: EntityManager;

    constructor(tx: EntityManager = AppDataSource.manager) {
        this.manager = tx;
    }

  
    public gestionar = async (carrera: Carrera): Promise<Carrera> => {
        const carreraExistente = await this.get({ nombre: carrera.nombre });
        
        if (carreraExistente) {
            return carreraExistente;
        }
        
        return this.setOrUpdate(carrera);
    }
    
    public get = async (where: FindOptionsWhere<Carrera>): Promise<Carrera | null> => {
        const carrera = await this.manager.findOne(Carrera, { where });
        
        if (!carrera) {
            logger.warn(`No se encontró la carrera con los criterios proporcionados.`);
        } else {
            logger.info(`Carrera encontrada con id ${carrera.id}`);
        }
        
        return carrera;
    };

    public setOrUpdate = async (data: Carrera): Promise<Carrera> => {
        if (data.id) {
            logger.debug(`Intentando actualizar carrera ${data.nombre} con ID ${data.id}`);
        } else {
            logger.debug(`Intentando agregar carrera ${data.nombre}`);
        }
        
        const carreraGuardada = await this.manager.save(Carrera, data);
        logger.info(`Guardando carrera con id ${carreraGuardada.id}`);
        
        return carreraGuardada;
    };

    public getAll = async (where?: FindOptionsWhere<Carrera>): Promise<Carrera[]> => {
        const carreras = await this.manager.find(Carrera, { where });
        
        if (!carreras.length) {
            logger.warn(`No se encontraron carreras con los datos requeridos.`);
        } else {
            logger.info(`Se encontraron ${carreras.length} carreras.`);
        }
        
        return carreras;
    }
}