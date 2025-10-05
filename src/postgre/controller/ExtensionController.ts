import { FindOptionsWhere, Repository } from 'typeorm';
import { Extension } from '../entity/Extension';
import { EntityControllerInterface } from './EntityControllerInterface';
import logger from '../../log/logger';
import { AppDataSource } from '../data-source';
export class ExtensionController implements EntityControllerInterface<Extension> {

    private extensionRepositorio: Repository<Extension>;

    constructor(tx = AppDataSource) {
        this.extensionRepositorio = tx.getRepository(Extension);
    }

    gestionar = async (data: Extension): Promise<Extension> => {
        const existente = await this.get(data);
        return existente ?? await this.setOrUpdate(data);
    }

    get = async (data: Extension) => {
        const where: FindOptionsWhere<Extension> = {
            actividad: data.actividad,
            tipo_actividad: data.tipo_actividad
        };
        logger.debug(`Buscando extension ${where.actividad}/${where.tipo_actividad}.`);
        return await this.extensionRepositorio.findOne({
            where
        }).then(value => {
            if (!value) {
                logger.warn(`No se encontró la extension con actividad ${data.actividad}.`);
            }
            return value;
        });
    }

    getAll = async (data?: Extension) => {
        const where = data as unknown as FindOptionsWhere<Extension>;
        logger.debug(`Buscando Extensions.`);
        return await this.extensionRepositorio.find({
            where
        }).then(value => {
            if (!value.length) {
                logger.warn(`No se encontró ninguna Extension con los datos requeridos.`);
            } else {
                logger.info(`Se encontraron ${value.length} Extensions.`);
            }
            return value;
        });

    }

    setOrUpdate = async (data: Extension) => {
        if (data.id) {
            logger.debug(`Intentando actualizar la extension con ${data.id}`);
        } else {
            logger.debug(`Intentando agregar la extension ${data.actividad}`);
        }
        return await this.extensionRepositorio.save(data).then(value => {
            logger.info(`Guardando extension con id ${value.id}`);
            return value;
        });
    }


}