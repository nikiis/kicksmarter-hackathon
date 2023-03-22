import error from '@/middleware/error';
import graphql from '@/routes/graphql';
import { Application } from 'express';

export default (app: Application) => {
    app.use('/graphql', graphql);

    // if something goes wrong with the database, this has to be at the last stage
    app.use(error);
};
