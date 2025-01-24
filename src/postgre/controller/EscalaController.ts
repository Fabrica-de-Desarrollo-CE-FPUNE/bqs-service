import { Repository } from "typeorm";
import { Escala } from "../entity/Escala";
import { AppDataSource } from "../data-source";
import logger from "../../log/logger";

export class EscalaController {
    private escalaRepositorio: Repository<Escala>;

    constructor() {
        this.escalaRepositorio = AppDataSource.getRepository(Escala);
    }

    public async gestionarEscala(escala: string) {
        return await this.escalaRepositorio.findOne({
            where: { nombre: escala }
        }).then(async value => {
            if (!value) {
                logger.warn(`No se encontró la escala con estructura ${escala}, creando una nueva.`);
                return await this.escalaRepositorio.save(new Escala(escala)).then(value => {
                    logger.info(`Guardando escala con id ${value.id}`);
                    return value;
                });
            }
            return value;
        });
    }
}
