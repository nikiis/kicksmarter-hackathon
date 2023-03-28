// @ts-ignore
import express from 'express';
import config from 'config';
import winston from 'winston';

import configExpress from '@/startup/configExpress';
import logging from '@/startup/logging';
import { dbConnect } from '@/startup/dbConnect';
import prod from '@/startup/prod';
// import validation from '@/startup/validation';
import routes from '@/startup/routes';

const app = express();

configExpress(app);
logging(app);
dbConnect(config.get<string>('MONGODB_NAME_DATA'));

if (app.get('env') === 'production') {
    prod(app);
}
// validation();
routes(app);

const port = config.get<number>('PORT');
const server = app.listen(port, () => winston.info(`Listening on port ${port}...`));

export default server;
