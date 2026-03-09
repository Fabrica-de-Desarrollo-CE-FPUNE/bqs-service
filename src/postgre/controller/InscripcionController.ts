import { EntityManager, FindOptionsWhere } from "typeorm";
import { Inscripcion } from "../entity/Inscripcion";
import { AppDataSource } from "../data-source";
import logger from "../../log/logger";
import { EntityControllerInterface } from './EntityControllerInterface';

export class InscripcionController implements EntityControllerInterface<Inscripcion> {

    private manager: EntityManager;

    constructor(tx: EntityManager = AppDataSource.manager) {
        this.manager = tx;
    }

    public gestionar = async (data: Inscripcion): Promise<Inscripcion> => {
       
        const inscripcionExistente = await this.get(data);

        if (inscripcionExistente) {
            return inscripcionExistente;
        }

        return this.setOrUpdate(data);
    }

    public get = async (where: FindOptionsWhere<Inscripcion>): Promise<Inscripcion | null> => {
        logger.debug(`Buscando inscripción.`);
        const inscripcion = await this.manager.findOne(Inscripcion, { where, loadEagerRelations: true });

        if (!inscripcion) {
            logger.warn(`No se encontró la inscripción.`);
        }

        return inscripcion;
    }

    public getAll = async (where?: FindOptionsWhere<Inscripcion>): Promise<Inscripcion[]> => {
        logger.debug(`Buscando inscripciones.`);
        const inscripciones = await this.manager.find(Inscripcion,
            {
                where,
                loadEagerRelations:false,
                relations:{
                    materiaCarrera:{
                        materia:true
                    }
                }
            });

        if (!inscripciones.length) {
            logger.warn(`No se encontraron inscripciones con los datos requeridos.`);
        }

        return inscripciones;
    };

    public setOrUpdate = async (data: Inscripcion): Promise<Inscripcion> => {
        const inscripcionGuardada = await this.manager.save(Inscripcion, data);
        logger.info(`Guardando inscripción con id ${inscripcionGuardada.id}`);

        return inscripcionGuardada;
    };
}