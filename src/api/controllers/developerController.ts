import { Response, Request, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { info_estudiante } from "../../types/ConsultorInfoTipos/ConsultorEstudianteTipos";
import { EstudianteError } from '../errors/EstudianteError';

/**
 * Controlador para operaciones relacionadas con desarrolladores.
 * 
 * @version 1.0.0
 * @author David Delvalle Rojas
 */
export class DeveloperController {

    /**
     * Obtener información del estudiante.
     * 
     * @param {Request} req - Objeto de solicitud HTTP.
     * @param {Response} res - Objeto de respuesta HTTP.
     * @param {NextFunction} next - Función para pasar al siguiente middleware.
     * 
     * @returns {Promise<void>} - Retorna una promesa que resuelve a void.
     * 
     * @throws {EstudianteError.notFoundEstudianteInfo} - Error lanzado si falla1 está presente en la query.
     * @throws {EstudianteError.notServiceEstudiante} - Error lanzado si falla2 está presente en la query.
     * 
     * @example
     * // Ejemplo de llamada a este método
     * app.get('/info-estudiante', developerController.getInfoEstudiante);
     */
    public getInfoEstudiante = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { falla1, falla2 } = req.query;

            if (falla1) {
                throw EstudianteError.notFoundEstudianteInfo();
            }

            if (falla2) {
                throw EstudianteError.notServiceEstudiante();
            }

            const data: info_estudiante = {
                nombre: 'Michael',
                apellido: 'Jackson',
                cedula: '6161000', 
                cedula_nombre_apellido:'*'
            };

            res.status(StatusCodes.OK).json(data);

        } catch (error) {
            next(error);
        }
    }
}
