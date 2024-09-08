import { StatusCodes } from "http-status-codes";
import ErrorConStatusConstructor from "./ErrorConStatusConstructor";

/**
 * Clase para errores específicos de estudiantes, extendiendo ErrorConStatus.
 * 
 * @author David Delvalle Rojas
 * @version 1.0.0
 */
export class EstudianteError {

    /**
     * Genera un error de tipo "No encontrado" para información de estudiantes.
     * @returns Un objeto ErrorWithStatus con el mensaje y el código de estado 404.
     */
    public static notFoundEstudianteInfo(): ErrorConStatusConstructor {
        return new ErrorConStatusConstructor('No encontramos la información del estudiante.', StatusCodes.NOT_FOUND);
    }

    /**
     * Genera un error de tipo "Servicio no disponible" para estudiantes.
     * @returns Un objeto ErrorWithStatus con el mensaje y el código de estado 503.
     */
    public static notServiceEstudiante(): ErrorConStatusConstructor {
        return new ErrorConStatusConstructor('Servicio de estudiante no disponible.', StatusCodes.SERVICE_UNAVAILABLE);
    }

    /**
     * Genera un error de tipo "Datos no enviados correctamente" para la obtencion de los datos del estudiantes
     * @returns Un objeto ErrorWithStatus con el mensaje y el código de estado 400.
     */
    public static notValidRequestEstudiante(): ErrorConStatusConstructor{
        return new ErrorConStatusConstructor('La cedula/pass no fueron enviados Correctamente', StatusCodes.BAD_REQUEST);
    }

    
    /**
     * Genera un error de tipo "el cuerpo de la request es invalidad" al momento de hacer la request al server.
     * @returns Un objeto ErrorWithStatus con el mensaje y el código de estado 400.
     */

    public static notValidBodyEstudiante(): ErrorConStatusConstructor{
        return new ErrorConStatusConstructor('El cuerpo de la request no es valida', StatusCodes.BAD_REQUEST);
    }

}
