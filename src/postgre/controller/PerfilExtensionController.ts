import { EntityManager, FindOptionsWhere } from "typeorm";
import { PerfilExtension } from "../entity/PerfilExtension";
import { EntityControllerInterface } from "./EntityControllerInterface";
import logger from "../../log/logger";
import { AppDataSource } from "../data-source";

export class PerfilExtensionController implements EntityControllerInterface<PerfilExtension> {

    private manager: EntityManager;

    constructor(tx: EntityManager = AppDataSource.manager) {
        this.manager = tx;
    }

    public gestionar = async (data: PerfilExtension): Promise<PerfilExtension> => {
        const where = {
            perfil: data.perfil,
            extension: data.extension
        };
        const perfilExtensionExistente = await this.get(where);

        if (perfilExtensionExistente) {
            return perfilExtensionExistente;
        }

        return this.setOrUpdate(data);
    }

    public get = async (where: FindOptionsWhere<PerfilExtension>): Promise<PerfilExtension | null> => {
        logger.debug(`Buscando PerfilExtension.`);
        const perfilExtension = await this.manager.findOne(PerfilExtension, { where });

        if (!perfilExtension) {
            logger.warn(`No se encontró la PerfilExtension.`);
        }
        
        return perfilExtension;
    }

    public getAll = async (where?: FindOptionsWhere<PerfilExtension>): Promise<PerfilExtension[]> => {
        logger.debug(`Buscando PerfilExtensions.`);
        const perfilExtensions = await this.manager.find(PerfilExtension, { where });

        if (!perfilExtensions.length) {
            logger.warn(`No se encontró ninguna PerfilExtension con los datos requeridos.`);
        } else {
            logger.info(`Se encontraron ${perfilExtensions.length} PerfilExtensions.`);
        }

        return perfilExtensions;
    }

    public setOrUpdate = async (data: PerfilExtension): Promise<PerfilExtension> => {
        if (data.id) {
            logger.debug(`Intentando actualizar la PerfilExtension con id ${data.id}`);
        } else {
            logger.debug(`Intentando agregar la PerfilExtension.`);
        }

        const perfilExtensionGuardada = await this.manager.save(PerfilExtension, data);
        logger.info(`Guardando PerfilExtension con id ${perfilExtensionGuardada.id}`);

        return perfilExtensionGuardada;
    }
}