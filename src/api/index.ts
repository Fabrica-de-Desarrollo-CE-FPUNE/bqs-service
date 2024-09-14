
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { router } from './routes';
import bodyParser from 'body-parser';
import { PuppeteerManager } from '../bot/scraper/PuppeteerManager';

const app = express();
const PORT = process.env.PORT || 3000;
PuppeteerManager.getInstance().initialize();
app.use(bodyParser.json());
app.use('/api', router);

app.listen(PORT, () => {
  console.log(`API Server is running on port ${PORT}`);
});
