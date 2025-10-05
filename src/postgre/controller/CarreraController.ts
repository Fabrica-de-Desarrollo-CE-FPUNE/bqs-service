import { FindOptionsWhere, Repository } from "typeorm";
import { Carrera } from "../entity/Carrera";
import { AppDataSource } from "../data-source";
import { EntityControllerInterface } from "./EntityControllerInterface";
import logger from "../../log/logger";

export class CarreraController implements EntityControllerInterface<Carrera>{

    private carreraRepositorio: Repository<Carrera>;

    constructor(tx = AppDataSource) {
        this.carreraRepositorio = tx.getRepository(Carrera);
    }

    gestionar =  async (carrera: Carrera) => {
        return await this.get(carrera).then(async value => {
            if(!value){
                return this.setOrUpdate(carrera);
            }
            return value
        });
    }
    
    get = async (data: Carrera) => {
        const {nombre} = data as unknown as FindOptionsWhere<Carrera>;
        return await this.carreraRepositorio.findOne({
            where: {nombre}
        }).then(value=>{
            if(!value){
                logger.warn(`No se encontró la carrera ${nombre}`);
            } else {
                logger.info(`Carrera encontrada con id ${value.id}`);
            }
            return value;
        });
    };

    setOrUpdate = async (data: Carrera) => {
        if(data.id){
            logger.debug(`Intentando actualizar carrera ${data.nombre} con ID ${data.id}`);
        } else {
            logger.debug(`Intentando agregar carrera ${data.nombre}`);
        }
        return await this.carreraRepositorio.save(data).then(value => {
            logger.info(`Guardando carrera con id ${value.id}`);
            return value;
        })
    };

    getAll = async (data?: Carrera) => {
        const where = data as unknown as FindOptionsWhere<Carrera>;
        return await this.carreraRepositorio.find({
            where
        }).then(value=>{
            if(!value.length){
                logger.warn(`No se encontró la carreras con los datos requeridos.`);
            } else {
                logger.info(`Se encontraron ${value.length} carreras.`);
            }
            return value;
        });
    }

}