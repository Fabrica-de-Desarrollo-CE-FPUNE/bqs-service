import ErrorConStatus from "../../errors/ErrorConStatus";

/**
 * Clase base para errores personalizados con un código de estado HTTP.
 *  @version 1.0.0
 *  @autor David Delvalle Rojas
 */
export class ErrorConStatusConstructor extends Error implements ErrorConStatus {
    status?: number;

    /**
     * Constructor de ErrorConStatusConstructor.
     * @param message El mensaje de error.
     * @param status El código de estado HTTP asociado con el error.
     */
    constructor(message: string, status?: number) {
        super(message);
        this.status = status; // Asignar el status correctamente
        // Asegurar que el nombre del error coincide con el nombre de la clase
        this.name = this.constructor.name;
        // Capturar la traza del error
        Error.captureStackTrace(this, this.constructor);
    }
}

export default ErrorConStatusConstructor;
