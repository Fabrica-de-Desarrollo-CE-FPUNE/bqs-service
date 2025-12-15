import { Router } from "express";
import { EstudianteController } from "../controllers/EstudianteController";
import { authenticateToken } from "../middlewares/AuthMiddleware";
import { errorHandler } from "../middlewares/ErrorMiddleware";
import { EscalaController } from "../controllers/EscalaController";

enum URLEnum {
    perfil = '/perfil',
    materias = '/materia',
    materia = '/materia/:id',
    escalas = '/escalas'
}


const estudianteRouter: Router = Router();

const estudianteController = new EstudianteController();
const escalaController = new EscalaController();


estudianteRouter.use(authenticateToken);
estudianteRouter.get(URLEnum.perfil, estudianteController.getPerfilEstudiante);
estudianteRouter.get(URLEnum.materias, estudianteController.getEvaluacionParcial);
estudianteRouter.get(URLEnum.materia, estudianteController.getMateriaDetalleEstudiante);
estudianteRouter.get(URLEnum.escalas, escalaController.getAll);
estudianteRouter.use(errorHandler);

export default estudianteRouter;