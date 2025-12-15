import e, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { EstudianteError } from '../errors/EstudianteError';
import logger from '../../log/logger';
import { UsuarioController } from '../../postgre/controller/UsuarioController';

const JWT_SECRET: string  = process.env.JWT_SECRET!;

const usuarioController = new UsuarioController();

// Middleware para autenticación con JWT
export async function authenticateToken(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization;
    if (!token) {
      throw EstudianteError.Unauthorized();
    }
    logger.debug(`Token recibido: ${token}`);
    jwt.verify(token.split(' ')[1], JWT_SECRET, async (err: any, decoded:any) => {
      if (err) {
        throw EstudianteError.Unauthorized();
      }
      logger.debug('Token decodificado.');
      const usuario = await usuarioController.getById(decoded!.u as string);
      if(!usuario) {
        throw EstudianteError.Unauthorized();
      }
      req.body = {
        usuario,
        ...req.body
      };
      next();
    });
  } catch (error) {
    next(error);
  }
}