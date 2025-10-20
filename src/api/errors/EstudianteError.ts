import { StatusCodes } from "http-status-codes";
import ErrorConStatusConstructor from "./ErrorConStatusConstructor";
import { ApiRequestErrorCodes } from "./ApiErrorCodes";

/**
 * Clase para errores específicos de estudiantes, extendiendo ErrorConStatus.
 * 
 * @author David Delvalle Rojas
 * @version 1.0.0
 */
export class EstudianteError {
    public static newError(message: string, errorCode?: string, status?: number): ErrorConStatusConstructor{
        return new ErrorConStatusConstructor(message, status, errorCode);
    }

    /**
     * se usa cuando el formato del body es incorrecto
     * 
     * @returns ErrorConStatusConstructor
     */
    public static InvalidBodyFormRequest(): ErrorConStatusConstructor {
        return new ErrorConStatusConstructor('El body esta mal formado.', StatusCodes.BAD_REQUEST,ApiRequestErrorCodes.BAD_BODY_FORMAT);
    }
    /**
     * se usa cuando el body es un objeto vacio, es decir no se envio un body
     * @returns ErrorConStatusConstructor
     */
    public static NotBodyFormSent(): ErrorConStatusConstructor {
        return new ErrorConStatusConstructor('No se ha enviado un bodyform.', StatusCodes.BAD_REQUEST, ApiRequestErrorCodes.NOT_BODY_SENT);
    }
    /**
     * se usa cuando el token es invalido o haya expirado
     * @returns ErrorConStatusConstructor
     */

    public static Unauthorized() : ErrorConStatusConstructor {
        return new ErrorConStatusConstructor('Sesión invalida o expirado, intente iniciar la sesión nuevamente.',
            StatusCodes.UNAUTHORIZED,
            ApiRequestErrorCodes.UNAUTHORIZED
        )
    }

    /**
     * se usa cuando no se encuentra la informacion buscada
     * @returns ErrorConStatusConstructor
     */
    public static NoDataFound() : ErrorConStatusConstructor {
        return new ErrorConStatusConstructor('No se encontró la información buscada, intente nuevamente más tarde.',
            StatusCodes.NOT_FOUND,
            ApiRequestErrorCodes.NO_DATA_FOUND
        )
    }
}
