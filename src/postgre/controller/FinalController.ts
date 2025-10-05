import { FindOptionsWhere, Repository } from "typeorm";
import { ExamenFinal } from "../entity/ExamenFinal";
import { AppDataSource } from "../data-source";
import logger from "../../log/logger";
import { EntityControllerInterface } from "./EntityControllerInterface";

export class FinalController implements EntityControllerInterface<ExamenFinal> {

    private finalesRepositorio: Repository<ExamenFinal>;

    constructor(tx = AppDataSource) {
        this.finalesRepositorio = tx.getRepository(ExamenFinal);
    }


    getAll: (data?: ExamenFinal | undefined) => Promise<ExamenFinal[]>;
    
    gestionar = async (data: ExamenFinal) => {
        return await this.get(data).then(async value => {
            if(!value){
                return await this.setOrUpdate(data);
            }
            return value;
        })
    }
    get = async (data: ExamenFinal) => {
        const where = data as unknown as FindOptionsWhere<ExamenFinal>;
        return this.finalesRepositorio.findOne({
            where
        }).then(value=>{
            if(!value){
                logger.warn(`No se encontró el examen.`);
            }
            return value;
        });

    }
    setOrUpdate = async (data: ExamenFinal) => {
        return await this.finalesRepositorio.save(data);
    }

}
