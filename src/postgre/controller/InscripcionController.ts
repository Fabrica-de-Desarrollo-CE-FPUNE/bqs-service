import { FindOptionsWhere, Repository } from "typeorm";
import { Inscripcion } from "../entity/Inscripcion";
import { AppDataSource } from "../data-source";
import logger from "../../log/logger";
import { EntityControllerInterface } from './EntityControllerInterface';

export class InscripcionController implements EntityControllerInterface<Inscripcion> {
    
    private inscripcionRepositorio: Repository<Inscripcion>;

    constructor() {
        this.inscripcionRepositorio = AppDataSource.getRepository(Inscripcion);
    }
    
    gestionar = async (data: Inscripcion) => {
        return await this.get(data).then(async value => {
            if(!value){
                return this.setOrUpdate(data);
            }
            return value;
        })
    }
    
    get = async (data: Inscripcion) => {
        const where = data as unknown as FindOptionsWhere<Inscripcion>;
        logger.debug(`Buscando inscripción`);
        return await this.inscripcionRepositorio.findOne({
            where
        }).then(value=>{
            if(!value){
                logger.warn(`No se encontró la inscripción.`);
            }
            return value;
        });
    }

    getAll = async (data?: Inscripcion | undefined) => {
        const {perfil} = data as unknown as FindOptionsWhere<Inscripcion>;
        logger.debug(`Buscando inscripción`);
        return await this.inscripcionRepositorio.find({
            where:{
                perfil
            }
        }).then(value=>{
            if(!value){
                logger.warn(`No se encontró la inscripción.`);
            }
            return value;
        });
    };

    setOrUpdate = async (data: Inscripcion) => {
        return await this.inscripcionRepositorio.save(data).then(value => {
            logger.info(`Guardando inscripción con id ${value.id}`);
            return value;
        });
    };


}
