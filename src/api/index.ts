
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import bodyParser from 'body-parser';
import estudianteRouter from './routers/EstudianteRouter';
import { PuppeteerManager } from '../bot/scraper/PuppeteerManager';
import logger from '../log/logger';
import UnknownRouter from './routers/UnknownRoutes';
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/api',estudianteRouter);
app.use(UnknownRouter);

logger.debug(`the express server app is attempting to listen on port ${PORT}`);
app.listen(PORT, () => {
  try{
    logger.info(`The api server is running on port ${PORT}`);
    PuppeteerManager.getInstance().initialize();
    logger.info("puppeeteer has initiliazed");
  }catch(error){
    logger.error("something bad happend at initiliazation of the server", error);
  }
});
