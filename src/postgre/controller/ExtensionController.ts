import { EntityManager, FindOptionsWhere } from 'typeorm';
import { Extension } from '../entity/Extension';
import { EntityControllerInterface } from './EntityControllerInterface';
import logger from '../../log/logger';
import { AppDataSource } from '../data-source';

export class ExtensionController implements EntityControllerInterface<Extension> {

    private manager: EntityManager;

    constructor(tx: EntityManager = AppDataSource.manager) {
        this.manager = tx;
    }

    public gestionar = async (data: Extension): Promise<Extension> => {
        const where = {
            actividad: data.actividad,
            tipo_actividad: data.tipo_actividad
        };
        const existente = await this.get(where);
        
        return existente ?? this.setOrUpdate(data);
    }

    public get = async (where: FindOptionsWhere<Extension>): Promise<Extension | null> => {
        logger.debug(`Buscando extension.`);
        const extension = await this.manager.findOne(Extension, { where });

        if (!extension) {
            logger.warn(`No se encontró la extension.`);
        }
        
        return extension;
    }

    public getAll = async (where?: FindOptionsWhere<Extension>): Promise<Extension[]> => {
        logger.debug(`Buscando extensions.`);
        const extensions = await this.manager.find(Extension, { where });

        if (!extensions.length) {
            logger.warn(`No se encontró ninguna extension con los datos requeridos.`);
        } else {
            logger.info(`Se encontraron ${extensions.length} extensions.`);
        }

        return extensions;
    }

    public setOrUpdate = async (data: Extension): Promise<Extension> => {
        if (data.id) {
            logger.debug(`Intentando actualizar la extension con id ${data.id}`);
        } else {
            logger.debug(`Intentando agregar la extension ${data.actividad}`);
        }

        const extensionGuardada = await this.manager.save(Extension, data);
        logger.info(`Guardando extension con id ${extensionGuardada.id}`);

        return extensionGuardada;
    }
}