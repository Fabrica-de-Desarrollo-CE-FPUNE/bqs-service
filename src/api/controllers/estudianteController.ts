import { Response, Request, NextFunction } from "express";
import { ConsultorDataService } from "../../core/ConsultorService";
import { EstudianteError } from "../errors/EstudianteError";
import { Alumno_credencial_login } from "../../types/ConsultorEstudianteCredenciales.types";
import { StatusCodes } from "http-status-codes";
import { ConsultorServiceError } from "../../core/ConsultorServiceError";

export class EstudianteController {

    public getInfoEstudiante = async (req:Request, res:Response, next:NextFunction) : Promise<void> => {
        try {
            if(!req.body){
               throw EstudianteError.NotBodyFormSent();
            }
            const {cedula, pass} = req.body;
            
            if(!cedula || !pass){
               throw EstudianteError.InvalidBodyFormRequest();
            }
            const credenciales: Alumno_credencial_login = {
                cedula: cedula, 
                contrasenia: pass
            }
            const consultor_servicio: ConsultorDataService = new ConsultorDataService();
            const estudiante_data = await consultor_servicio.getAll_Consultor_Info(credenciales);
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