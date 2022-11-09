import Koa from 'koa';
import cors from '@koa/cors';
import morgan from 'koa-morgan';
import Router from 'koa-router';
import through from 'through2';
import serve from 'koa-static';
import { ApplicationError, NotFoundError } from './errors';
import createDataLoaders from './utils/createDataLoaders';
import logger from './utils/logger';

import api from './api';
import koaBody from 'koa-body';

const logStream = through((chunk) => {
  logger.info(chunk.toString());
});

const errorHandler = () => async (ctx, next) => {
  try {
    await next();
  } catch (e) {
    const normalizedError =
      e instanceof ApplicationError
        ? e
        : new ApplicationError('Something went wrong');

    ctx.status = normalizedError.status || 500;
    ctx.body = normalizedError;

    logger.error(e, { path: ctx.request.path });
  }
};

const app = new Koa();

app.use(cors());

const apiRouter = new Router();

apiRouter.use('/api', api.routes());

app.use(apiRouter.routes());
app.use(errorHandler());

app.use(morgan('combined', { stream: logStream }));

app.use(async (ctx, next) => {
  ctx.dataLoaders = createDataLoaders();
  await next();
});

app.use(serve(__dirname, '/uploads/'));

app.use((ctx) => {
  throw new NotFoundError(`The path "${ctx.request.path}" is not found`);
});

export default app;
