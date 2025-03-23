import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import dotenv from 'dotenv';
import mainRouter from './routers/index.js';
import errorHandler from './middlewares/errorHandler.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }),
);

app.use(
  pino({
    transport: {
      target: 'pino-pretty',
      options: { colorize: true },
    },
  }),
);

app.use('/', mainRouter);

app.use('*', notFoundHandler);

app.use(errorHandler);

export default app;
