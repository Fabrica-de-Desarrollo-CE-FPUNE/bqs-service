import { Request, Response, Router } from "express";
import { EstudianteController } from "../controllers/EstudianteController";
import { errorHandler } from "../middlewares/ErrorMiddleware";


const estudianteRouter:Router = Router();

const urlRoute:string = '/estudiante';

const controller = new EstudianteController();

estudianteRouter.get(urlRoute, controller.getInfoEstudiante, errorHandler);

export default estudianteRouter;