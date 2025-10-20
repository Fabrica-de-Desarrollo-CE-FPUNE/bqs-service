import express from 'express';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { authenticateToken } from '../../src/api/middlewares/AuthMiddleware';
import { firmarToken } from '../../src/api/utils/TokenUtil';
import { StatusCodes } from 'http-status-codes';
import { ClaveTokenUtil } from '../../src/api/utils/ClaveTokenUtil';

// Crear una aplicación Express para las pruebas
const app = express();
app.use(express.json());


app.get('/protected', authenticateToken, (req, res) => {
    res.status(200).json({ mensaje: 'Acceso concedido', usuario: req.body });
});

// Rutas para firmar tokens y probar la autenticación
app.post('/token', (req, res) => {
    const { data } = req.body;
    const token = firmarToken(data);
    res.json({ token });
});

describe('Autenticación con JWT', () => {
    beforeAll(() => {
        const claveTokenUtil = ClaveTokenUtil.getInstance();
        claveTokenUtil.generarClave();
    });

    test('debería permitir el acceso con un token válido', async () => {
        const token = firmarToken({ usuario: 'prueba' });
        
        const response = await request(app)
            .get('/protected')
            .set('Authorization', `Bearer ${token}`);
        
        expect(response.status).toBe(StatusCodes.OK);
        expect(response.body).toMatchObject({ mensaje: 'Acceso concedido', usuario: { usuario: 'prueba' } });
    });

    test('debería rechazar el acceso sin un token', async () => {
        const response = await request(app).get('/protected');

        expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
        expect(response.body).toEqual({ error: 'Token de autenticación requerido' });
    });

    test('debería rechazar el acceso con un token inválido', async () => {
        const response = await request(app)
            .get('/protected')
            .set('Authorization', 'Bearer token_invalido');
        
        expect(response.status).toBe(StatusCodes.FORBIDDEN);
        expect(response.body).toEqual({ error: 'Token de autenticación inválido' });
    });

    test('debería generar un token correctamente', async () => {
        const data = { usuario: 'prueba' };
        const response = await request(app)
            .post('/token')
            .send({ data });
        
        const token = response.body.token;
        const decoded = jwt.verify(token, ClaveTokenUtil.getInstance().getClave());
        
        expect(decoded).toMatchObject(data);
    });
});
