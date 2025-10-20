import { Router } from "express";
import { EstudianteController } from "../controllers/EstudianteController";
import { authenticateToken } from "../middlewares/AuthMiddleware";
import { errorHandler } from "../middlewares/ErrorMiddleware";

enum URLEnum {
    base = '/estudiante',
    perfil = '/estudiante/perfil',
    materias = '/estudiante/materias',
    materia = '/estudiante/materia'
}


const estudianteRouter:Router = Router();

const controller = new EstudianteController();

estudianteRouter.use(authenticateToken);
estudianteRouter.get(URLEnum.perfil, controller.getPerfilEstudiante);
estudianteRouter.get(URLEnum.materias, controller.getMateriasEstudiante);
estudianteRouter.get(URLEnum.materia, controller.getMateriaDetalleEstudiante);
estudianteRouter.use(errorHandler);

export default estudianteRouter;