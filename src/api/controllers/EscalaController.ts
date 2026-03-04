import { Request, Response, NextFunction } from "express"
import { ConsultorServiceError } from "../../core/ConsultorServiceError";
import { EstudianteError } from "../errors/EstudianteError";
import { getEscalas } from "../services/EscalasService";

export class EscalaController {

    public async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const escalas = await getEscalas();
            res.json(escalas);
        } catch (error) {
            if (error instanceof ConsultorServiceError) {
                next(EstudianteError.newError(error.message, error.errorCode));
            } else {
                next(error);
            }
        }
    }

}