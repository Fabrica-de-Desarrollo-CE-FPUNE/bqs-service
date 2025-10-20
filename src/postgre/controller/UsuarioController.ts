import { FindOptionsWhere, Repository } from "typeorm";
import { Usuario } from "../entity/Usuario";
import { AppDataSource } from "../data-source";
import logger from "../../log/logger";
import { EntityControllerInterface } from './EntityControllerInterface';

export class UsuarioController implements EntityControllerInterface<Usuario> {
    private usuarioRepositorio: Repository<Usuario>;

    constructor() {
        this.usuarioRepositorio = AppDataSource.getRepository(Usuario);
    }

    gestionar = async (data: Usuario) => {
        return this.get(data).then(async value => {
            if(!value) {
                return this.setOrUpdate(data);
            }
            return value;
        })
    }

    get = async  (data: Usuario) => {
        const where = data as unknown as FindOptionsWhere<Usuario>;
        logger.debug(`buscando usuario con cedula ${where.cedula}`)
        return await this.usuarioRepositorio.findOne({
            where
        }).then((value)=>{
            if(!value){
                logger.warn('no se encontró al usuario')
                return;
            }
            logger.info(`usuario encontrado id ${value.id}`);
            return value;
        })
    }
    getAll: (data?: Usuario | undefined) => Promise<Usuario[]>;

    setOrUpdate = async (data: Usuario) => {
        logger.debug(`intentando agregar usuario con cedula ${data.cedula}`);
        logger.info(`la contra hasheada es ${data.password}`)
        return await this.usuarioRepositorio.save(data).then(value => {
            logger.info(`Guardando usuario con id ${value.id}`);
            return value;
        });
    }

}
