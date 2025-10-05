import { FindOptionsWhere, Repository } from "typeorm";
import { Periodo } from "../entity/Periodo";
import { AppDataSource } from "../data-source";
import logger from "../../log/logger";

export class PeriodoController {

    private periodoRepositorio: Repository<Periodo>;

    constructor(tx = AppDataSource) {
        this.periodoRepositorio = tx.getRepository(Periodo);
    }
    gestionar = async (data: Periodo) => {
        return await this.get(data).then(async value => {
            if(!value){
                return await this.setOrUpdate(data);
            }
            return value;
        })
    }

    get = async (data: Periodo) => {

        const {nombre} = data as unknown as FindOptionsWhere<Periodo>;
        
        return this.periodoRepositorio.findOne({
            where: {
                nombre
            }
        }).then(value => {
            if(!value){
                logger.warn(`No se encontró el periodo ${nombre}.`);
            } else {
                logger.info(`Se encontró el periodo con id ${value.id}`)
            }
            return value;
        })
    }
    getAll = async (data?: Periodo ) => {
        const where = data as unknown as FindOptionsWhere<Periodo>;
        return this.periodoRepositorio.find({
            where
        }).then(value => {
            if(!value.length){
                logger.warn(`No se encontró los Periodoes con los datos requeridos.`);
            } else {
                logger.info(`Se encontraron ${value.length} Periodoes.`);
            }
            return value;
        })
    };
    setOrUpdate = async (data: Periodo) => {
        if(data.id){
            logger.debug(`Intentando actualizar periodo con ID ${data.id}`);
        } else {
            logger.debug(`Intentando agregar periodo`);
        }

        return this.periodoRepositorio.save(data).then(value => {
            logger.info(`Guardando carrera con id ${value.id}`);
            return value;
        });
    }
}

