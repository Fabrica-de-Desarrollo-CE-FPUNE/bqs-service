import { NextFunction, Response, Request } from "express";
import { EstudianteError } from "../errors/EstudianteError";
import logger from "../../log/logger";
import { StatusCodes } from "http-status-codes";
import { ConsultorServiceError } from "../../core/ConsultorServiceError";
import { Alumno_credencial_login } from "../../types/ConsultorEstudianteCredenciales.types";
import { firmarToken } from "../utils/TokenUtil";
import { authService } from "../services/AuthService";
export class AuthController {

    public getLoginToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
            logger.error('a body has not been sent');
            throw EstudianteError.NotBodyFormSent();
        }

        const { cedula, pass } = req.body;
        if (!cedula || !pass) {
            logger.error('An invalid form has been sent');
            throw EstudianteError.InvalidBodyFormRequest();
        }

        const credenciales: Alumno_credencial_login = {
            cedula: cedula,
            contrasenia: pass
        }
        try {
            const usuarioLogeado = await authService(credenciales);

            res.status(StatusCodes.OK).send({ token: firmarToken({ u: usuarioLogeado.id }) });

        } catch (error) {
            console.error('Error in AuthController.getLoginToken:', error);
            if (error instanceof ConsultorServiceError) {
                next(EstudianteError.newError(error.message, error.errorCode));
            } else {
                next(error);
            }

        }
    }

}