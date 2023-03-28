import error from '@/middleware/error';
import home from '@/routes/home';
import game from '@/routes/game';
import { Application } from 'express';

export default (app: Application) => {
    app.use('/', home);
    app.use('/game', game);
    // app.use('/playthrough', playthrough);

    // if something goes wrong with the database, this has to be at the last stage
    app.use(error);
};
