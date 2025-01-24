import { Repository } from "typeorm";
import { Inscripcion } from "../entity/Inscripcion";
import { AppDataSource } from "../data-source";
import logger from "../../log/logger";
import { info_inscripciones_asistencia } from "../../types/ConsultorEstudiante.types";
import { Perfil } from "../entity/Perfil";
import { Materia } from "../entity/Materia";
import { Escala } from "../entity/Escala";
import { Periodo } from "../entity/Periodo";

export class InscripcionController {
    private inscripcionRepositorio: Repository<Inscripcion>;

    constructor() {
        this.inscripcionRepositorio = AppDataSource.getRepository(Inscripcion);
    }

    public async getInscripcionMateriaDetalles(cedulaIdentidad:string, id:number){
        return await this.inscripcionRepositorio.findOne({
            where:{
                perfil:{cedulaIdentidad},
                materia:{id}
            },
        })
    }

    public async gestionarInscripcion(infoInscripcion: info_inscripciones_asistencia , perfil: Perfil, materia: Materia, periodo: Periodo, escala: Escala) {
        return await this.inscripcionRepositorio.findOne({
            where: { materia, periodo, perfil  }
        }).then(async value => {
            if (!value) {
                logger.warn(`No se encontró una inscripción para el usuario ${perfil.id} con materia ${materia.id}`);
                const inscripcion = new Inscripcion(infoInscripcion);
                inscripcion.periodo = periodo;
                inscripcion.escala = escala;
                inscripcion.perfil = perfil;
                inscripcion.materia = materia;
                return await this.inscripcionRepositorio.save(inscripcion).then(value => {
                    logger.info(`Guardando inscripción con id ${value.id}`);
                    return value;
                });
            }
            return value;
        });
    }
}
