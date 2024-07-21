import { Router } from "express";
import { DeveloperController } from "../controllers/developerController";

const developerRouter:Router = Router();

const urlRoute = '/dev';

const devController : DeveloperController = new DeveloperController();

developerRouter.get(urlRoute+'/estudiante', devController.getInfoEstudiante);

export default developerRouter;