import { StatusCodes } from "http-status-codes";
import ErrorConStatusConstructor from "./ErrorConStatusConstructor";

/**
 * Clase para errores específicos de estudiantes, extendiendo ErrorConStatus.
 * 
 * @author David Delvalle Rojas
 * @version 1.0.0
 */
export class EstudianteError {

    public static BAD_BODY_FORMAT = "BODY_ERR-1";
    public static NOT_BODY_SENT = "BODY_ERR-2";


    public static newError(message: string, errorCode?: string, status?: number): ErrorConStatusConstructor{
        return new ErrorConStatusConstructor(message, status, errorCode);
    }

    public static InvalidBodyFormRequest(): ErrorConStatusConstructor {
        return new ErrorConStatusConstructor('El body esta mal formado', StatusCodes.BAD_REQUEST,EstudianteError.BAD_BODY_FORMAT);
    }
    public static NotBodyFormSent(): ErrorConStatusConstructor{
        return new ErrorConStatusConstructor('No se ha enviado un bodyform', StatusCodes.BAD_REQUEST, EstudianteError.NOT_BODY_SENT);
    }
}
