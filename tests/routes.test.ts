import request from 'supertest';

import express from 'express';

import {router} from '../src/api/routes';

const app = express();

app.use(express.json());
app.use('/api', router);

describe('get /api/info', ()=>{

    it('should return error if user or pass is missing', async () => {
        const response = await request(app).get('/api/info/').query({});
        expect(response.status).toBe(404);
        expect(response.body).toEqual({
          Error: 'Error en el username o password'
        });
      });


});