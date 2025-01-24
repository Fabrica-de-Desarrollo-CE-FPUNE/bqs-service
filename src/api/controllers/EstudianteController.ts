import { Response, Request, NextFunction } from "express";
import { EstudianteError } from "../errors/EstudianteError";
import { Alumno_credencial_login } from "../../types/ConsultorEstudianteCredenciales.types";
import { StatusCodes } from "http-status-codes";
import { ConsultorServiceError } from "../../core/ConsultorServiceError";
import logger from "../../log/logger";
import { PerfilController } from "../../postgre/controller/PerfilController";
import { MateriaController } from "../../postgre/controller/MateriaController";
import { InscripcionController } from "../../postgre/controller/InscripcionController";

export class EstudianteController {

    private perfilController = new PerfilController();
    private materiaController = new MateriaController();
    private inscripcionController = new InscripcionController();

    

    public getPerfilEstudiante = async (req:Request, res:Response, next:NextFunction) : Promise<void> => {
        try {
            logger.debug("intentando extraer el perfil del estudiante")
            const usuario = req.body.usuario as Alumno_credencial_login;
            const perfil = await this.perfilController.getPerfil(usuario.cedula);
            if(!perfil) {
                throw EstudianteError.NoDataFound();
            }
            logger.info('información del perfil del estudiante encontrada, enviando...');
            res.status(StatusCodes.OK).send(perfil);
        } catch (error) {
            if(error instanceof ConsultorServiceError){
                next(EstudianteError.newError(error.message, error.errorCode));
            }else {
                next(error);
            }
        }
    }

    public getMateriasEstudiante  = async (req:Request, res:Response, next:NextFunction) : Promise<void> => {
        try {
            logger.debug("intentando extraer las materias del estudiante")
            const usuario = req.body.usuario as Alumno_credencial_login;
            const materias = await this.materiaController.getMaterias(usuario.cedula);
            if(!materias.length) {
                throw EstudianteError.NoDataFound();
            }
            logger.info('información de las materias del estudiante encontrada, enviando...');
            res.status(StatusCodes.OK).send(materias);
        } catch (error) {
            if(error instanceof ConsultorServiceError){
                next(EstudianteError.newError(error.message, error.errorCode));
            }else {
                next(error);
            }
        }
    }

    public getMateriaDetalleEstudiante  = async (req:Request, res:Response, next:NextFunction) : Promise<void> => {
        try {
            logger.debug("intentando extraer los detalles de la materia del estudiante")
            const usuario = req.body.usuario as Alumno_credencial_login;
            const id = req.query.id as unknown as number;
            logger.debug(`el id de la materia a buscar es ${id}`)
            const materia = await this.inscripcionController.getInscripcionMateriaDetalles(usuario.cedula, id);
            if(!materia) {
                throw EstudianteError.NoDataFound();
            }
            logger.info('información de las materias del estudiante encontrada, enviando...');
            res.status(StatusCodes.OK).send(materia);
        } catch (error) {
            if(error instanceof ConsultorServiceError){
                next(EstudianteError.newError(error.message, error.errorCode));
            }else {
                next(error);
            }
        }
    }


}