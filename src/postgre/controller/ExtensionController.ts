import { FindOptionsWhere, Repository } from 'typeorm';
import { Extension } from '../entity/Extension';
import { EntityControllerInterface } from './EntityControllerInterface';
import logger from '../../log/logger';
export class ExtensionController implements EntityControllerInterface<Extension> {

    private extensionRepositorio: Repository<Extension>;

    gestionar = async (data: Extension) => {
        return await this.get(data).then(async value => {
            if (!value) {
                return await this.setOrUpdate(data).then(value => {
                    return value;
                });
            }
            return value;
        });
    }

    get = async (data: Extension) => {
        const { actividad } = data as unknown as FindOptionsWhere<Extension>;
        logger.debug(`Buscando extension ${actividad}.`);
        return await this.extensionRepositorio.findOne({
            where: { actividad }
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