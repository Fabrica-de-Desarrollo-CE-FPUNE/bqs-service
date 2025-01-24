import { Repository } from "typeorm";
import { ExamenFinal } from "../entity/ExamenFinal";
import { Inscripcion } from "../entity/Inscripcion";
import { info_resultado_evaluacion_final } from "../../types/ConsultorEstudiante.types";
import { AppDataSource } from "../data-source";
import logger from "../../log/logger";

export class FinalController {
    private finalesRepositorio: Repository<ExamenFinal>;

    constructor() {
        this.finalesRepositorio = AppDataSource.getRepository(ExamenFinal);
    }

    public async gestionarFinales(inscripcion: Inscripcion, final: info_resultado_evaluacion_final) {
        return await this.finalesRepositorio.findOne({
            where: {
                inscripcion: inscripcion
            }
        }).then(async value => {
            if (!value) {
                logger.warn(`No se encontró una final correspondiente a inscripción con id ${inscripcion.id}, intentando crear uno nuevo`);
                const examenFinal = new ExamenFinal(final);
                examenFinal.inscripcion = inscripcion;
                return await this.finalesRepositorio.save(examenFinal).then(value => {
                    logger.info(`Guardando resultado final con id ${value.id}`);
                    return value;
                });
            }
            return value;
        });
    }
}
