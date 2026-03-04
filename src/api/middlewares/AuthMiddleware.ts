import e, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { EstudianteError } from '../errors/EstudianteError';
import logger from '../../log/logger';
import { UsuarioController } from '../../postgre/controller/UsuarioController';
import { PerfilController } from '../../postgre/controller/PerfilController';
import { setOrUpdateUsuario } from '../services/AuthService';
import { Alumno_credencial_login } from '../../types/ConsultorEstudianteCredenciales.types';
import { decrypt } from '../../utils/crypto';

const JWT_SECRET: string = process.env.JWT_SECRET!;

const usuarioController = new UsuarioController();
const perfilController = new PerfilController();

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

    const perfil = await perfilController.getByUsuario(usuario);

    if (perfil && perfil.fecha_actualizacion) {
      const TIEMPO = 3 * 24 * 60 * 60 * 1000; // 3 días en milisegundos
      const tiempoTranscurrido = Date.now() - perfil.fecha_actualizacion.getTime();
      if (tiempoTranscurrido > TIEMPO) {
        logger.info(`El perfil del usuario ${usuario.cedula} está desactualizado. Actualizando...`);
        perfil.fecha_actualizacion = new Date();
        await perfilController.setOrUpdate(perfil);
        const newCredentials: Alumno_credencial_login = {
          cedula: usuario.cedula,
          contrasenia: decrypt(usuario.password)
        }
        await setOrUpdateUsuario(newCredentials);
        logger.info(`Perfil del usuario ${usuario.cedula} actualizado correctamente.`);
      }
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