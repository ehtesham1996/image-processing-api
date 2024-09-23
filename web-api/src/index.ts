import cors from 'cors';
import express from 'express';
import { PORT } from '@config/env';
import imageRoutes from '@routes/image.routes';
import healthRoute from '@routes/health.routes';
import { AppDataSource } from '@database/connection';
import { errorHandler } from './middlewares/error-handler.middleware';

const app = express();

app.use(express.json());
app.use(cors());


app.use('/api', imageRoutes);
app.use('/', healthRoute);

app.use(errorHandler);


AppDataSource.initialize()
  .then(() => {
    console.log('Database connected');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error during Data Source initialization', error);
  });
