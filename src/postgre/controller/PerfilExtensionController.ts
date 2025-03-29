import { FindOptionsWhere, Repository } from "typeorm";
import { PerfilExtension } from "../entity/PerfilExtension";
import { EntityControllerInterface } from "./EntityControllerInterface";
import logger from "../../log/logger";

export class PerfilExtensionController implements EntityControllerInterface<PerfilExtension> {
    
    private extensionRepositorio: Repository<PerfilExtension>;

    gestionar = async (data: PerfilExtension) => {
        return await this.get(data).then(async value => {
            if (!value) {
                return await this.setOrUpdate(data).then(value => {
                    return value;
                });
            }
            return value;
        });
    }

    get = async (data: PerfilExtension) => {
        const { perfil, extension } = data as unknown as FindOptionsWhere<PerfilExtension>;
        logger.debug(`Buscando PerfilExtension.`);
        return await this.extensionRepositorio.findOne({
            where: {perfil, extension}
        }).then(value => {
            if (!value) {
                logger.warn(`No se encontró la PerfilExtension con actividad ${data.extension}.`);
            }
            return value;
        });
    }

    getAll = async (data?: PerfilExtension) => {
        const where = data as unknown as FindOptionsWhere<PerfilExtension>;
        logger.debug(`Buscando PerfilExtension.`);
        return await this.extensionRepositorio.find({
            where
        }).then(value => {
            if (!value.length) {
                logger.warn(`No se encontró ninguna PerfilExtension con los datos requeridos.`);
            } else {
                logger.info(`Se encontraron ${value.length} Extensions.`);
            }
            return value;
        });

    }

    setOrUpdate = async (data: PerfilExtension) => {
        if (data) {
            logger.debug(`Intentando actualizar la PerfilExtension con ${data}`);
        } else {
            logger.debug(`Intentando agregar la PerfilExtension ${data}`);
        }
        return await this.extensionRepositorio.save(data).then(value => {
            logger.info(`Guardando PerfilExtension con id ${value}`);
            return value;
        });
    }
}