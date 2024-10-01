import { Response, Request, NextFunction } from "express";
import { ConsultorDataService } from "../../core/ConsultorService";
import { EstudianteError } from "../errors/EstudianteError";
import { Alumno_credencial_login } from "../../types/ConsultorEstudianteCredenciales.types";
import { StatusCodes } from "http-status-codes";
import { ConsultorServiceError } from "../../core/ConsultorServiceError";
import logger from "../../log/logger";

export class EstudianteController {

    public getInfoEstudiante = async (req:Request, res:Response, next:NextFunction) : Promise<void> => {
        try {
            if(req.body.constructor === Object && Object.keys(req.body).length === 0){
                logger.error('a body has not been sent');
               throw EstudianteError.NotBodyFormSent();
            }
            const {cedula, pass} = req.body;
            
            if(!cedula || !pass){
                logger.error('An invalid form has been sent');
               throw EstudianteError.InvalidBodyFormRequest();
            }
            const credenciales: Alumno_credencial_login = {
                cedula: cedula, 
                contrasenia: pass
            }
            logger.debug('calling the core service for consultor data');
            const consultor_servicio: ConsultorDataService = new ConsultorDataService();
            const estudiante_data = await consultor_servicio.getAll_Consultor_Info(credenciales);
            logger.debug('returning the core service data to the client request');
            res.status(StatusCodes.OK).send(estudiante_data);
        } catch (error) {
            if(error instanceof ConsultorServiceError){
                next(EstudianteError.newError(error.message, error.errorCode));
            }else {
                next(error);
            }
        }
    }

}