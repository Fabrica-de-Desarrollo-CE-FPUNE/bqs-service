import { EntityManager, FindOptionsWhere } from "typeorm";
import { ResultadoParcial } from "../entity/ResultadoParcial";
import { AppDataSource } from "../data-source";
import logger from "../../log/logger";
import { EntityControllerInterface } from "./EntityControllerInterface";

export class ParcialController implements EntityControllerInterface<ResultadoParcial> {
    
    private manager: EntityManager;

    constructor(tx: EntityManager = AppDataSource.manager) {
        this.manager = tx;
    }

    public gestionar = async (data: ResultadoParcial): Promise<ResultadoParcial> => {
        const where = { inscripcion: data.inscripcion };
        const parcialExistente = await this.get(where);

        if (parcialExistente) {
            return parcialExistente;
        }

        return this.setOrUpdate(data);
    }

    public get = async (where: FindOptionsWhere<ResultadoParcial>): Promise<ResultadoParcial | null> => {
        logger.debug(`Buscando parcial.`);
        const parcial = await this.manager.findOne(ResultadoParcial, { where });

        if (!parcial) {
            logger.warn(`No se encontró el parcial.`);
        }

        return parcial;
    }
    
    public getAll = async (where?: FindOptionsWhere<ResultadoParcial>): Promise<ResultadoParcial[]> => {
        logger.debug(`Buscando parciales.`);
        const parciales = await this.manager.find(ResultadoParcial, { where });

        if (!parciales.length) {
            logger.warn(`No se encontraron parciales con los datos requeridos.`);
        }

        return parciales;
    };

    public setOrUpdate = async (data: ResultadoParcial): Promise<ResultadoParcial> => {
        const parcialGuardado = await this.manager.save(ResultadoParcial, data);
        logger.info(`Guardando parcial con id ${parcialGuardado.id}`);

        return parcialGuardado;
    };
}