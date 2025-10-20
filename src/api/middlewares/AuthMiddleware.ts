import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { EstudianteError } from '../errors/EstudianteError';
import logger from '../../log/logger';

const JWT_SECRET: string  = process.env.JWT_SECRET!;

// Middleware para autenticación con JWT
export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization;
    if (!token) {
      throw EstudianteError.Unauthorized();
    }
    logger.debug(`Token recibido: ${token}`);
    jwt.verify(token.split(' ')[1], JWT_SECRET, (err: any, decoded:any) => {
      if (err) {
        throw EstudianteError.Unauthorized();
      }
      logger.debug('Token decodificado.');
      req.body = {
        usuario:decoded!.u??'' as any as string,
        ...req.body
      };
      next();
    });
  } catch (error) {
    next(error);
  }
}