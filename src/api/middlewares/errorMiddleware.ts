import { NextFunction, Response, Request } from "express";
import ErrorConStatus from "../../types/errorConStatus";
import { StatusCodes } from "http-status-codes";

/**
 * Middleware de manejo de errores.
 * 
 * Este middleware captura errores en la aplicación, registra el stack trace en la consola,
 * y envía una respuesta JSON con el mensaje de error y el código de estado HTTP correspondiente.
 * 
 * @param {any} error - El error capturado. Se espera que sea de tipo ErrorConStatus.
 * @param {Request} req - Objeto de solicitud HTTP.
 * @param {Response} res - Objeto de respuesta HTTP.
 * @param {NextFunction} next - Función para pasar al siguiente middleware.
 * 
 * @returns {void} - No retorna valor, solo envía la respuesta HTTP.
 * 
 * @example
 * // Definir el middleware en una aplicación Express
 * app.use(errorHandler);
 * 
 * // Generar un error y pasarlo al middleware
 * app.get('/error', (req, res, next) => {
 *   const error = new Error('Fingiendo un error');
 *   error.status = 400; // Código de estado HTTP opcional
 *   next(error); // Pasar el error al middleware de manejo de errores
 * });
 * 
 * @version 1.0.0
 * @autor David Delvalle Rojas
 */
export const errorHandler = (error: any, req: Request, res: Response, next: NextFunction): void => {
  // Transformación del error tipo any a ErrorConStatus
  const errorStatus: ErrorConStatus = error as ErrorConStatus;

  // Registrar el stack trace del error en la consola
  console.error(errorStatus.stack);

  // Enviar respuesta HTTP con el mensaje de error y el código de estado
  res.status(errorStatus.status || StatusCodes.INTERNAL_SERVER_ERROR).json({
    error: {
      message: errorStatus.message,
    },
  });
};
