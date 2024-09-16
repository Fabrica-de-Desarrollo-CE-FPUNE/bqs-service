
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import bodyParser from 'body-parser';
import estudianteRouter from './routers/estudianteRouter';
import { PuppeteerManager } from '../bot/scraper/PuppeteerManager';
const app = express();
const PORT = process.env.PORT || 3000;
PuppeteerManager.getInstance().initialize();
app.use(bodyParser.json());
app.use('/api', estudianteRouter);

app.listen(PORT, () => {
  console.log(`API Server is running on port ${PORT}`);
});
