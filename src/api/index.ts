
import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import estudianteRouter from './routers/EstudianteRouter';

import { PuppeteerManager } from '../bot/scraper/PuppeteerManager';
import logger from '../log/logger';
import UnknownRouter from './routers/UnknownRoutes';
import authorizationRouter from './routers/AuthorizationRouter';
import statusRouter from './routers/StatusRouter';

const app = express();
const PORT = 3000;
const HOST = process.env.HOST!;
app.use(cors(
  {
    origin: "*",
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
))
app.use(express.json());
app.use('/api', authorizationRouter);
app.use('/api/status', statusRouter);
app.use('/api/estudiante', estudianteRouter);
app.use(UnknownRouter);


logger.debug(`the express server app is attempting to listen on port ${PORT}`);
app.listen(PORT, HOST, () => {
  try {
    logger.info(`The api server is running on port ${PORT}`);
    PuppeteerManager.getInstance().initialize();
    logger.info("puppeeteer has initiliazed");
  } catch (error) {
    logger.error("something bad happend at initiliazation of the server", error);
  }
});
