import express from 'express';
import cors from 'cors';
import { env } from './utils/env.js';
import contactRouter from './routers/contacts.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import errorHandler from './middlewares/errorHandler.js';
import authRouter from './routers/auth.js';
import cookieParser from 'cookie-parser';
/* import logger from './middlewares/logger.js'; */

const setupServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cookieParser());
  app.use(cors());
  /* app.use(logger); */
  app.use('/contacts', contactRouter);
  app.use('/auth', authRouter);

  app.use('*', notFoundHandler);
  app.use(errorHandler);

  const PORT = Number(env('PORT', '3000'));
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

export default setupServer;
