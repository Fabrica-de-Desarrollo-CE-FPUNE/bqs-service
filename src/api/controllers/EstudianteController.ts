import { Response, Request, NextFunction } from "express";
import { EstudianteError } from "../errors/EstudianteError";
import { StatusCodes } from "http-status-codes";
import { ConsultorServiceError } from "../../core/ConsultorServiceError";
import logger from "../../log/logger";
import { InscripcionController } from "../../postgre/controller/InscripcionController";
import { getPerfilEstudianteService } from "../services/EstudianteService";
import { getMateriaByIdService, getMateriasInscriptas } from "../services/MateriasService";
import { Usuario } from "../../postgre/entity/Usuario";

export class EstudianteController {

    public getPerfilEstudiante = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            logger.debug("intentando extraer el perfil del estudiante")
            const usuario = req.body.usuario as Usuario;
            const perfil = await getPerfilEstudianteService(usuario);
            const contacto = await 
            res.status(StatusCodes.OK).send(perfil);
        } catch (error) {
            if (error instanceof ConsultorServiceError) {
                next(EstudianteError.newError(error.message, error.errorCode));
            } else {
                next(error);
            }
        }
    }

    public getEvaluacionParcial = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const usuario = req.body.usuario as Usuario;
            const materias = await getMateriasInscriptas(usuario);
            res.status(StatusCodes.OK).send(materias);
        } catch (error) {
            if (error instanceof ConsultorServiceError) {
                next(EstudianteError.newError(error.message, error.errorCode));
            } else {
                next(error);
            }
        }
    }

    public getMateriaDetalleEstudiante = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const usuario = req.body.usuario as Usuario;
            const id_materia = req.params.id as unknown as number;
            const materia = await getMateriaByIdService(usuario, id_materia)
            res.json(materia);
        } catch (error) {
            if (error instanceof ConsultorServiceError) {
                next(EstudianteError.newError(error.message, error.errorCode));
            } else {
                next(error);
            }
        }
    }


}