import { Repository } from "typeorm";
import { Materia } from "../entity/Materia";
import { AppDataSource } from "../data-source";
import logger from "../../log/logger";
import { getMateria } from '../../utils/dataUtil';

export class MateriaController {
    
    private materiaRepositorio: Repository<Materia>;

    constructor() {
        this.materiaRepositorio = AppDataSource.getRepository(Materia);
    }

    public async getMaterias(cedulaIdentidad:string){
        return this.materiaRepositorio.find({
            where:{
                inscripciones:{
                    perfil:{
                        cedulaIdentidad
                    }
                }
            }
        })
    }


    public async gestionarMateria(materia: Materia) {
        return await this.materiaRepositorio.findOne({
            where: { id: materia.id }
        }).then(async value => {
            if (!value) {
                logger.warn(`No se encontró la materia ${materia.nombre}, intentando crear una nueva.`);
                return await this.materiaRepositorio.save(materia).then(value => {
                    logger.info(`Guardando materia con id ${value.id}`);
                    return value;
                });
            }
            return value;
        });
    }
}
