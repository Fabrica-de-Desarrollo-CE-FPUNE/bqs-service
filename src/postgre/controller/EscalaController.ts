import { EntityManager, FindOptionsWhere } from "typeorm";
import { Escala } from "../entity/Escala";
import { AppDataSource } from "../data-source";
import logger from "../../log/logger";
import { EntityControllerInterface } from "./EntityControllerInterface";

export class EscalaController implements EntityControllerInterface<Escala> {

    private manager: EntityManager;

    constructor(tx: EntityManager = AppDataSource.manager) {
        this.manager = tx;
    }

    public gestionar = async (data: Escala): Promise<Escala> => {
        const where = { nombre: data.nombre };
        const escalaExistente = await this.get(where);

        if (escalaExistente) {
            return escalaExistente;
        }

        return this.setOrUpdate(data);
    }

    public get = async (where: FindOptionsWhere<Escala>): Promise<Escala | null> => {
        logger.debug(`Buscando escala.`);
        const escala = await this.manager.findOne(Escala, { where });

        if (!escala) {
            logger.warn(`No se encontró la escala.`);
        }
        
        return escala;
    }

    public getAll = async (where?: FindOptionsWhere<Escala>): Promise<Escala[]> => {
        logger.debug(`Buscando escalas.`);
        const escalas = await this.manager.find(Escala, { where });

        if (!escalas.length) {
            logger.warn(`No se encontró ninguna escala con los datos requeridos.`);
        } else {
            logger.info(`Se encontraron ${escalas.length} escalas.`);
        }

        return escalas;
    }

    public setOrUpdate = async (data: Escala): Promise<Escala> => {
        if (data.id) {
            logger.debug(`Intentando actualizar la escala con id ${data.id}`);
        } else {
            logger.debug(`Intentando agregar la escala ${data.nombre}`);
        }

        const escalaGuardada = await this.manager.save(Escala, data);
        logger.info(`Guardando escala con id ${escalaGuardada.id}`);

        return escalaGuardada;
    }
}