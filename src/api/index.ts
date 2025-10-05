
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import estudianteRouter from './routers/EstudianteRouter';

import { PuppeteerManager } from '../bot/scraper/PuppeteerManager';
import logger from '../log/logger';
import UnknownRouter from './routers/UnknownRoutes';
import authorizationRouter from './routers/AuthorizationRouter';
const app = express();
const PORT = Number(process.env.PORT!);
const HOST = process.env.HOST!;
app.use(cors()) //Falta configurar a donde ir, de esta manera permita que cualquiera lo consuma
app.use(express.json());
app.use('/api', authorizationRouter, estudianteRouter);
app.use(UnknownRouter);

logger.debug(`the express server app is attempting to listen on port ${PORT}`);
app.listen(PORT, HOST, () => {
  try{
    logger.info(`The api server is running on port ${PORT}`);
    PuppeteerManager.getInstance().initialize();
    logger.info("puppeeteer has initiliazed");
  }catch(error){
    logger.error("something bad happend at initiliazation of the server", error);
  }
});
