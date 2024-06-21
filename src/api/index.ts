

import express from 'express';
import { router } from './routes';
import bodyParser from 'body-parser';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/api', router);

app.listen(PORT, () => {
  console.log(`API Server is running on port ${PORT}`);
});
