import { EntityManager, FindOptionsWhere } from "typeorm";
import { EntityControllerInterface } from "./EntityControllerInterface";
import { AppDataSource } from "../data-source";
import { Calificaciones } from "../entity/Calificaciones";
import logger from "../../log/logger";

export class CalificacionesController implements EntityControllerInterface<Calificaciones> {

     private manager: EntityManager;

    constructor(tx: EntityManager = AppDataSource.manager) {
        this.manager = tx;
    }

    public  gestionar = async (data: Calificaciones) =>  {
        const {materia, perfil, acta} = data;
        const calificacionExistente = await this.get({ materia:{
            id:materia.id
        }, perfil: {
            id:perfil.id
        }, acta });
        
        if (calificacionExistente) {
            return calificacionExistente;
        }
        
        return this.setOrUpdate(data);

    }; 

    public get = async (where: FindOptionsWhere<Calificaciones>): Promise<Calificaciones | null> => {
        const calificaciones = await this.manager.findOne(Calificaciones, { where });
        
        if (!calificaciones) {
            logger.warn(`No se encontró la calificacion con los criterios proporcionados.`);
        } else {
            logger.info(`Calificacion encontrada con id ${calificaciones.id}`);
        }
        
        return calificaciones;
    };

    public getAll = async (where?: FindOptionsWhere<Calificaciones>): Promise<Calificaciones[]> => {
        const calificaciones = await this.manager.find(Calificaciones, { where });

        if (!calificaciones.length) {
            logger.warn(`No se encontraron calificaciones con los datos requeridos.`);
        } else {
            logger.info(`Se encontraron ${calificaciones.length} calificaciones.`);
        }

        return calificaciones;
    };

    public setOrUpdate = async (data: Calificaciones): Promise<Calificaciones> => {
        logger.debug(`Intentando guardar calificación para el usuario ${data.perfil?.id} en la materia ${data.materia?.id}`);
        const calificacionGuardada = await this.manager.save(Calificaciones, data);
        logger.info(`Calificación guardada con id ${calificacionGuardada.id}`);
        return calificacionGuardada;
    };

}