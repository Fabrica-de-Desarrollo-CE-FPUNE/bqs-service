import logger from "../../log/logger";
import { PerfilController } from "../../postgre/controller/PerfilController";
import { Usuario } from "../../postgre/entity/Usuario";
import { EstudianteError } from "../errors/EstudianteError";

const perfilController = new PerfilController();

export const getPerfilEstudianteService = async (usuario: Usuario) => {
    logger.debug("intentando extraer el perfil del estudiante")
    const perfil = await perfilController.get({ usuario });
    if (!perfil) {
        throw EstudianteError.NoDataFound();
    }
    logger.info('información del perfil del estudiante encontrada, enviando...');
    return perfil;
}