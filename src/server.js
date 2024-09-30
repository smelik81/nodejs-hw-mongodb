import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { env } from './utils/env.js';
import contactRouter from './routers/contacts.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import errorHandler from './middlewares/errorHandler.js';
import authRouter from './routers/auth.js';
import { UPLOAD_DIR } from './constans/index.js';
/* import logger from './middlewares/logger.js'; */

const setupServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cookieParser());
  app.use('/uploads', express.static(UPLOAD_DIR));
  app.use(cors());
  /* app.use(express.static('uploads'));
   app.use(logger); */
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
