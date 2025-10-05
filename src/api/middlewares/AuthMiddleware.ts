import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { EstudianteError } from '../errors/EstudianteError';
import logger from '../../log/logger';
import { Alumno_credencial_login } from '../../types/ConsultorEstudianteCredenciales.types';

const SECRET_KEY: string  = process.env.SECRET_KEY!;

// Middleware para autenticación con JWT
export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization;
    if (!token) {
      throw EstudianteError.Unauthorized();
    }
    logger.debug(`Token recibido: ${token}`);
    jwt.verify(token.split(' ')[1], SECRET_KEY, (err: any, decoded) => {
      if (err) {
        throw EstudianteError.Unauthorized();
      }
      logger.debug('Token decodificado.');
      req.body = {
        usuario:decoded as Alumno_credencial_login,
        ...req.body
      };
      next();
    });
  } catch (error) {
    next(error);
  }
}