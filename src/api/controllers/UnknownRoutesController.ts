import { Response, Request, NextFunction } from "express";
import logger from "../../log/logger";
import { ApiRequestErrorCodes } from "../errors/ApiErrorCodes";
export class UnknownRoutesController {
    public handleUnknowRoutes = async (req:Request, res:Response, next:NextFunction) : Promise<void> =>{
          logger.warn(`Unknown route called: ${req.method} ${req.originalUrl}`);
          res.status(404).json({
            error: {
              message: `la url '${req.originalUrl}' no esta soportada.`, 
              errCode: ApiRequestErrorCodes.UNKNOWN_REQUEST_URL
            }
          });
    }
}