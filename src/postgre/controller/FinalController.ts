import { EntityManager, FindOptionsWhere } from "typeorm";
import { ExamenFinal } from "../entity/ExamenFinal";
import { AppDataSource } from "../data-source";
import logger from "../../log/logger";
import { EntityControllerInterface } from "./EntityControllerInterface";

export class FinalController implements EntityControllerInterface<ExamenFinal> {

    private manager: EntityManager;

    constructor(tx: EntityManager = AppDataSource.manager) {
        this.manager = tx;
    }
    
    public gestionar = async (data: ExamenFinal): Promise<ExamenFinal> => {
        const where = { inscripcion: data.inscripcion, fecha: data.fecha };
        const examenExistente = await this.get(where);

        if (examenExistente) {
            return examenExistente;
        }

        return this.setOrUpdate(data);
    }

    public get = async (where: FindOptionsWhere<ExamenFinal>): Promise<ExamenFinal | null> => {
        const examen = await this.manager.findOne(ExamenFinal, { where });

        if (!examen) {
            logger.warn(`No se encontró el examen.`);
        }

        return examen;
    }

    public setOrUpdate = async (data: ExamenFinal): Promise<ExamenFinal> => {
        return this.manager.save(ExamenFinal, data);
    }

    public getAll = async (where?: FindOptionsWhere<ExamenFinal>): Promise<ExamenFinal[]> => {
        const examenes = await this.manager.find(ExamenFinal, { where });

        if (!examenes.length) {
            logger.warn(`No se encontraron exámenes con los datos requeridos.`);
        }

        return examenes;
    }
}