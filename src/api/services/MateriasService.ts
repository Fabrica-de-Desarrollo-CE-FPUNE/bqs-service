import logger from "../../log/logger";
import { CalificacionesController } from "../../postgre/controller/CalificacionesController";
import { InscripcionController } from "../../postgre/controller/InscripcionController";
import { MateriaCarreraController } from "../../postgre/controller/MateriaCarreraController";
import { MateriaController } from "../../postgre/controller/MateriaController";
import { PerfilController } from "../../postgre/controller/PerfilController";
import { Usuario } from "../../postgre/entity/Usuario";
import { EstudianteError } from "../errors/EstudianteError";

const inscripcionController = new InscripcionController();
const perfilController = new PerfilController();
const materiaController = new MateriaController();
const calificacionesController = new CalificacionesController();

export const getMateriasInscriptas = async (usuario: Usuario) => {
    logger.debug("intentando extraer las materias del estudiante")
    
    const materias = await inscripcionController.getAll({
        perfil: {
            cedula_de_identidad: usuario.cedula
        }
    });
    if (!materias.length) {
        throw EstudianteError.NoDataFound();
    }
    const materiasData = materias.map(materia => ({
        semestre: materia.materiaCarrera.semestre,
        nombre: materia.materiaCarrera.materia.nombre,
        id: materia.materiaCarrera.id
    }));
    logger.info('información de las materias del estudiante encontrada, enviando...');
    return materiasData ;
}

export const getMateriaByIdService = async (usuario: Usuario, id_materia: number) => {
    logger.debug(`el id de la materia a buscar es ${id_materia}`);
    const perfil = await perfilController.getByUsuario(usuario);
    const materiaCarrera = await materiaController.get({
        id:id_materia
    });
    if (!perfil || !materiaCarrera) {
        throw EstudianteError.NoDataFound();
    }

    const inscripcion = await inscripcionController.get({
        perfil, materiaCarrera
    });
  
    logger.info('información de las materias del estudiante encontrada, enviando...');
    return inscripcion
}

export const getResultadosFinalesService = async (usuario: Usuario, id_materia: number) => {
    const perfil = await perfilController.getByUsuario(usuario);
    const materia = await materiaController.get({
        id:id_materia
    });
    if (!perfil || !materia) {
        throw EstudianteError.NoDataFound();
    }
    const resultadosFinales = await calificacionesController.getAll({
        perfil, materia
    });
    logger.info('información de los resultados finales del estudiante encontrada, enviando...');
    
    return resultadosFinales;

    
}