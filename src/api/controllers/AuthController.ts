import { NextFunction, Response, Request } from "express";
import { UsuarioController } from "../../postgre/controller/UsuarioController";
import { EstudianteError } from "../errors/EstudianteError";
import logger from "../../log/logger";
import { StatusCodes } from "http-status-codes";
import { ConsultorDataService } from "../../core/ConsultorService";
import { ConsultorServiceError } from "../../core/ConsultorServiceError";
import { Alumno_credencial_login } from "../../types/ConsultorEstudianteCredenciales.types";
import { firmarToken } from "../utils/TokenUtil";
import { AlumnoController } from "../../postgre/controller/AlumnoController";
import { compararHash } from "../../utils/dataUtil";

export class AuthController {

    private usuarioController = new UsuarioController();
    private alumnoController = new AlumnoController();

    public getLoginToken = async (req:Request, res:Response, next:NextFunction) : Promise<void> => {
        try {
            if(req.body.constructor === Object && Object.keys(req.body).length === 0){
                logger.error('a body has not been sent');
               throw EstudianteError.NotBodyFormSent();
            }

            const {cedula,pass} = req.body;
            if(!cedula || !pass){
                logger.error('An invalid form has been sent');
               throw EstudianteError.InvalidBodyFormRequest();
            }

            const credenciales: Alumno_credencial_login = {
                cedula: cedula, 
                contrasenia: pass
            }

            const usuario = await this.usuarioController.getUsuario(cedula);

            if(!usuario) {
                logger.debug('calling the core service for consultor data');
                const consultor_servicio: ConsultorDataService = new ConsultorDataService();
                const estudiante_data = await consultor_servicio.getAll_Consultor_Info(credenciales);
                const usuario = await this.usuarioController.addUsuario(cedula, pass);
                this.alumnoController.guardarAlumnoData(usuario, estudiante_data);
            } else if(!(await compararHash(usuario.password, pass))){
                throw EstudianteError.Unauthorized()
            }
                       
            logger.debug('creando token y enviando al usuario')
            res.status(StatusCodes.OK).send({token:firmarToken(credenciales)});

        } catch (error) {
            if(error instanceof ConsultorServiceError){
                next(EstudianteError.newError(error.message, error.errorCode));
            }else {
                next(error);
            }

        }
    }

}