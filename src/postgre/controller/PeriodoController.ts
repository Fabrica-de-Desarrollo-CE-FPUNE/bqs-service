import { EntityManager, FindOptionsWhere } from "typeorm";
import { Periodo } from "../entity/Periodo";
import { AppDataSource } from "../data-source";
import logger from "../../log/logger";

export class PeriodoController {

    private manager: EntityManager;

    constructor(tx: EntityManager = AppDataSource.manager) {
        this.manager = tx;
    }

    public gestionar = async (data: Periodo): Promise<Periodo> => {
        const where = { nombre: data.nombre };
        const periodoExistente = await this.get(where);

        if (periodoExistente) {
            return periodoExistente;
        }

        return this.setOrUpdate(data);
    }

    public get = async (where: FindOptionsWhere<Periodo>): Promise<Periodo | null> => {
        const periodo = await this.manager.findOne(Periodo, { where });

        if (!periodo) {
            logger.warn(`No se encontró el periodo.`);
        } else {
            logger.info(`Se encontró el periodo con id ${periodo.id}`);
        }

        return periodo;
    }

    public getAll = async (where?: FindOptionsWhere<Periodo>): Promise<Periodo[]> => {
        const periodos = await this.manager.find(Periodo, { where });

        if (!periodos.length) {
            logger.warn(`No se encontraron los periodos con los datos requeridos.`);
        } else {
            logger.info(`Se encontraron ${periodos.length} periodos.`);
        }

        return periodos;
    };

    public setOrUpdate = async (data: Periodo): Promise<Periodo> => {
        if (data.id) {
            logger.debug(`Intentando actualizar periodo con ID ${data.id}`);
        } else {
            logger.debug(`Intentando agregar periodo`);
        }

        const periodoGuardado = await this.manager.save(Periodo, data);
        logger.info(`Guardando periodo con id ${periodoGuardado.id}`);
        
        return periodoGuardado;
    }
}