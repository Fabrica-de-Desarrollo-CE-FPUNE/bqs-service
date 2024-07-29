import { Response, Request, NextFunction } from "express";

export class EstudianteController {

    public getInfoEstudiante = async (req:Request, res:Response, next:NextFunction) : Promise<void> => {
        try {
            // No hace nada, falta capa de servicio.
        } catch (error) {
            next(error);
        }
    }

}