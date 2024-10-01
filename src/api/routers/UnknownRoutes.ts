import { Router } from 'express';
import { UnknownRoutesController } from '../controllers/UnknownRoutesController';

const UnknownRouter = Router();
const unknownRoutesHandler = new UnknownRoutesController().handleUnknowRoutes;
UnknownRouter.use('*', unknownRoutesHandler);
export default UnknownRouter;
