import { Repository } from "typeorm";
import { ResultadoParcial } from "../entity/ResultadoParcial";
import { Inscripcion } from "../entity/Inscripcion";
import { info_resultado_parcial } from "../../types/ConsultorEstudiante.types";
import { AppDataSource } from "../data-source";
import logger from "../../log/logger";

export class ParcialController {
    private parcialesRepositorio: Repository<ResultadoParcial>;

    constructor() {
        this.parcialesRepositorio = AppDataSource.getRepository(ResultadoParcial);
    }

    public async gestionarParcial(inscripcion: Inscripcion, parciales: info_resultado_parcial) {
        return await this.parcialesRepositorio.findOne({
            where: {
                inscripcion
            }
        }).then(async value => {
            if (!value) {
                logger.warn(`No se encontró la parcial con respecto a la inscripción ${inscripcion.id}, intentando crear uno`);
                const parcial = new ResultadoParcial(parciales);
                parcial.inscripcion = inscripcion;
                return await this.parcialesRepositorio.save(parcial).then(value => {
                    logger.info(`Guardando resultados parciales ${value.id}`);
                    return value;
                });
            }
            return value;
        });
    }
}
