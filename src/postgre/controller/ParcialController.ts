import { FindOptionsWhere, Repository } from "typeorm";
import { ResultadoParcial } from "../entity/ResultadoParcial";
import { Inscripcion } from "../entity/Inscripcion";
import { info_resultado_parcial } from "../../types/ConsultorEstudiante.types";
import { AppDataSource } from "../data-source";
import logger from "../../log/logger";
import { EntityControllerInterface } from "./EntityControllerInterface";

export class ParcialController implements EntityControllerInterface<ResultadoParcial> {
    private parcialesRepositorio: Repository<ResultadoParcial>;

    constructor(tx = AppDataSource) {
        this.parcialesRepositorio = tx.getRepository(ResultadoParcial);
    }

    gestionar = async (data: ResultadoParcial) => {
        return await this.get(data).then(async value => {
            if(!value){
                return await this.setOrUpdate(data);
            }
            return value;
        });
    }

    get = async (data: ResultadoParcial) => {
        const {inscripcion} = data as unknown as FindOptionsWhere<ResultadoParcial>;
        logger.debug(`Buscando parcial`);
        return await this.parcialesRepositorio.findOne({
            where:{
                inscripcion
            }
        }).then(value=>{
            if(!value){
                logger.warn(`No se encontró la parcial.`);
            }
            return value;
        });
    }
    getAll: (data?: ResultadoParcial | undefined) => Promise<ResultadoParcial[]>;

    setOrUpdate = async (data: ResultadoParcial) => {
        return await this.parcialesRepositorio.save(data).then(value=>{
            logger.info(`Guardando parcial con id ${value.id}`);
            return value;
        })
    };

}
