import request from 'supertest';

import express from 'express';

import estudianteRouter from '../src/api/routers/estudianteRouter';

const app = express();

app.use(express.json());
app.use('/api', estudianteRouter);

describe('get /api/estudiante', ()=>{

    it('debe dar como resultado un simple ok', async () => {
        const response = await request(app).get('/api/estudiante/').query({});
        expect(response.status).toBe(200);
        expect(response.body).toEqual({data:'Ok'});
      });


});