import { Request, Response, Router } from "express";
import { EstudianteController } from "../controllers/estudianteController";


const estudianteRouter:Router = Router();

const urlRoute:string = '/estudiante';

const controller = new EstudianteController();

estudianteRouter.get(urlRoute, controller.getInfoEstudiante);

export default estudianteRouter;