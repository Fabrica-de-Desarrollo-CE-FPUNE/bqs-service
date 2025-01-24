import { Router } from "express";
import { authenticateToken } from "../middlewares/AuthMiddleware";
import { errorHandler } from "../middlewares/ErrorMiddleware";
import { AuthController } from "../controllers/AuthController";

enum URLEnum {
    login = '/login',
    logout = '/logout'
}

const authorizationRouter = Router();
const authController = new AuthController();

authorizationRouter.post(URLEnum.login, authController.getLoginToken);

// En construcción mmmm
authorizationRouter.get(URLEnum.logout, authenticateToken);

authorizationRouter.use(errorHandler);

export default authorizationRouter;