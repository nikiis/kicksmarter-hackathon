import morgan from 'morgan';
import winston from 'winston';
import { Application } from 'express';

// TODO in the future log into database
// import 'winston-mongodb';

// only required to import this and setup done :)
import 'express-async-errors';

// This is how to debug if wanted.
// export DEBUG=app:startup,app:db
// export DEBUG=app:**
// export DEBUG=
import Debug from 'debug';
const debugStartup = Debug('app:startup');
const dbDebug = Debug('app:db');

export default (app: Application) => {
    winston.exitOnError = true;
    winston.add(new winston.transports.File({ filename: 'error.log', level: 'error' }));
    winston.add(new winston.transports.File({ filename: 'combined.log' }));

    winston.exceptions.handle(new winston.transports.File({ filename: 'uncaughtExceptions.log' }));
    // TODO for some reason winston.rejections.handle(...) doesn't exist :/ Something needs to be fixed.
    process.on('unhandledRejection', (ex) => {
        throw ex;
    });

    if (app.get('env') !== 'deployment') {
        app.use(morgan('tiny'));

        winston.add(
            new winston.transports.Console({
                level: 'info',
                format: winston.format.simple(),
                // prettyPrint: true,
                // colorize: true
            })
        );
    }
};
