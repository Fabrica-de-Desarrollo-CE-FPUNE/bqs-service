import request from 'supertest';
import express from 'express';
import { StatusCodes } from 'http-status-codes';
import developerRouter from '../src/api/routers/developerRouter';
import { errorHandler } from '../src/api/middlewares/errorMiddleware';

const app = express();

app.use(express.json());
app.use('/api', developerRouter);
app.use(errorHandler);

/**
 * Tests para el endpoint /api/dev/estudiante
 */
describe('get /api/dev/estudiante', () => {

    /**
     * Caso 1: Sin query, debe dar como resultado el status 200 OK y el cuerpo de la respuesta correspondiente.
     */
    it('caso 1: sin query, debe dar como resultado el status 200 OK.', async () => {
        const response = await request(app).get('/api/dev/estudiante/').query({});
        expect(response.status).toBe(StatusCodes.OK);
        expect(response.body).toEqual(
          {
            nombre:'Michael',
            apellido:'Jackson',
            cedula:'6161000'
          }
        );
    });

    /**
     * Caso 2: Con query falla1, debe emitir el status 404 NOT_FOUND.
     */
    it('caso 2: con query, debe fallar y emitir el status 404 NOT_FOUND.', async () => {
      const response = await request(app).get('/api/dev/estudiante/').query({ falla1: true });
      expect(response.status).toBe(StatusCodes.NOT_FOUND);
      console.log(response.body);
    });

    /**
     * Caso 3: Con query falla2, debe emitir el status 503 SERVICE_UNAVAILABLE.
     */
    it('caso 3: con query, debe fallar y emitir el status 503 SERVICE_UNAVAILABLE.', async () => {
      const response = await request(app).get('/api/dev/estudiante/').query({ falla2: true });
      expect(response.status).toBe(StatusCodes.SERVICE_UNAVAILABLE);
      console.log(response.body);
    });

});
