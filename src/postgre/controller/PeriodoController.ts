import { Repository } from "typeorm";
import { Periodo } from "../entity/Periodo";
import { AppDataSource } from "../data-source";
import logger from "../../log/logger";
import { info_inscripciones_asistencia } from "../../types/ConsultorEstudiante.types";
import { parseFechaDDMMYYYY } from "../../utils/dataUtil";

export class PeriodoController {
    private periodoRepositorio: Repository<Periodo>;

    constructor() {
        this.periodoRepositorio = AppDataSource.getRepository(Periodo);
    }

    public async gestionarPeriodo(inscripcion: info_inscripciones_asistencia) {
        return await this.periodoRepositorio.findOne({
            where: {
                fechaInscripcion: parseFechaDDMMYYYY(inscripcion.fecha_inscripto),
                fechaVigencia: parseFechaDDMMYYYY(inscripcion.validez)
            }
        }).then(async value => {
            if (!value) {
                logger.warn(`No se encontró el periodo con inscripcion ${inscripcion.fecha_inscripto}`);
                const nuevoPeriodo = new Periodo(inscripcion);
                return await this.periodoRepositorio.save(nuevoPeriodo).then(value => {
                    logger.info(`Guardando periodo con id ${value.id}`);
                    return value;
                });
            }
            return value;
        });
    }
}
