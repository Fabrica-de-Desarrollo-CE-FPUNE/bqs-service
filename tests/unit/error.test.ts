import request from 'supertest';
import express, { NextFunction, Request, Response, Router } from 'express';
import { errorHandler } from '../../src/api/middlewares/errorMiddleware';
import ErrorConStatus from '../../src/errors/ErrorConStatus';
import { StatusCodes } from 'http-status-codes';

// Middleware de prueba que fuerza un error
const errorTest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Forzar error con la clase Error
    throw new Error('Fingiendo error custom de login');
  } catch (error) {
    // Convertir error a ErrorConStatus y establecer status
    (error as ErrorConStatus).status = StatusCodes.UNAUTHORIZED;
    // Pasar el error al siguiente middleware
    next(error);
  }
};

// Crear un router y definir la ruta que usa el middleware de prueba
const errorRouter = Router();
errorRouter.get('/dev/error', errorTest);

// Crear una aplicación Express y usar el router y el middleware de errores
const app = express();
app.use(express.json());
app.use('/api', errorRouter);  // Montar el router en /api
app.use(errorHandler);         // Usar el middleware de manejo de errores

// Describir el conjunto de pruebas para la ruta /api/dev/error
describe('GET /api/dev/error', () => {
  it('debe dar como resultado un simple ok', async () => {
    const response = await request(app).get('/api/dev/error').query({});
    // Verificar que la respuesta tenga un estado 401 (UNAUTHORIZED)
    expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    // Verificar que el cuerpo de la respuesta sea el esperado
    expect(response.body).toEqual({
      error: {
        message: 'Fingiendo error custom de login',
      },
    });
  });
});
