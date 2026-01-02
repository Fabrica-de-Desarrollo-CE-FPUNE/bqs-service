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
    const authHeader = req.headers.authorization;
    
    // 1. Validar existencia del token
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw EstudianteError.Unauthorized();
    }

    const token = authHeader.split(' ')[1];

    // 2. Verificar el token (Convertido a promesa para que funcione con await)
    // Esto permite que si hay un error, caiga directamente al catch(error) de abajo
    const decoded = await new Promise<any>((resolve, reject) => {
      jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) reject(EstudianteError.Unauthorized());
        else resolve(decoded);
      });
    });

    logger.debug('Token decodificado correctamente.');

    // 3. Buscar el usuario
    const usuario = await usuarioController.getById(decoded!.u as string);
    if (!usuario) {
      throw EstudianteError.Unauthorized();
    }

    // 4. Adjuntar usuario a la request
    req.body = {
      usuario,
      ...req.body
    };

    next();
  } catch (error) {
    // Aquí es donde ahora sí caerán todos los "Unauthorized"
    logger.error(`Error de autenticación: ${error}`);
    next(error);
  }
}