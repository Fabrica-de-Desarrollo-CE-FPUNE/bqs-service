import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';

const SECRET_KEY: string  = "la super contraseña que debería ser anonima y ubicada como variable de entorno"+
" pero que siento que es muy inseguro igual y prefiero hacer que sea dinamico";

// Middleware para autenticación con JWT
export function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['authorization'];
    if (!token) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Token de autenticación requerido' });
    }
    jwt.verify(token.split(' ')[1], SECRET_KEY, (err: any, decoded) => {
      if (err) {
        return res.status(403).json({ error: 'Token de autenticación inválido' });
      }
      req.body.usuario = decoded; // Los datos del usuario decodificados se adjuntan a req.body.usuario
      next();
    });
  }