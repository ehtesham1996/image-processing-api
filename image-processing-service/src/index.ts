import cors from 'cors';
import express from 'express';
import { PORT } from '@config/env';
import healthRoute from '@routes/health.routes';
import { startSqsPolling } from './jobs/sqs.job';
import { apiErrorHandler } from '@middlewares/error-handler.middleware';

const app = express();

app.use(express.json());
app.use(cors());

app.use('/', healthRoute);
app.use(apiErrorHandler);

startSqsPolling();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
