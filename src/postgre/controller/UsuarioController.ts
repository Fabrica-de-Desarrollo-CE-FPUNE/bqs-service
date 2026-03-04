import { EntityManager, FindOptionsWhere } from "typeorm";
import { Usuario } from "../entity/Usuario";
import { AppDataSource } from "../data-source";
import logger from "../../log/logger";
import { EntityControllerInterface } from './EntityControllerInterface';

export class UsuarioController implements EntityControllerInterface<Usuario> {

    private manager: EntityManager;

    constructor(tx: EntityManager = AppDataSource.manager) {
        this.manager = tx;
    }

    public gestionar = async (data: Usuario): Promise<Usuario> => {
       
        const usuarioExistente = await this.get(data);

        if (usuarioExistente) {
            return usuarioExistente;
        }

        return this.setOrUpdate(data);
    }

    public getById = async (id_usuario:string) => {
        return await this.manager.findOne(Usuario, {
            where: {
                id: id_usuario
            }
        })
    }

    public get = async (data:Usuario): Promise<Usuario | null> => {
        const where: FindOptionsWhere<Usuario> = { cedula: data.cedula };
        logger.debug(`Buscando usuario.`);
        const usuario = await this.manager.findOne(Usuario, { where });

        if (!usuario) {
            logger.warn('No se encontró al usuario.');
        } else {
            logger.info(`Usuario encontrado con id ${usuario.id}.`);
        }

        return usuario;
    }

    public getAll = async (): Promise<Usuario[]> => {
        const usuarios = await this.manager.find(Usuario);

        if (!usuarios.length) {
            logger.warn(`No se encontraron usuarios con los datos requeridos.`);
        }

        return usuarios;
    }

    public setOrUpdate = async (data: Usuario): Promise<Usuario> => {
        logger.debug(`Intentando agregar usuario con cedula ${data.cedula}.`);
        const usuarioGuardado = await this.manager.save(Usuario, data);
        logger.info(`Guardando usuario con id ${usuarioGuardado.id}.`);

        return usuarioGuardado;
    }
}