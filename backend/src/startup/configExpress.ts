import cors from 'cors';
import { json, urlencoded, Application } from 'express';

export default (app: Application) => {
    app.use(cors());
    app.use(json());
    app.use(urlencoded({ extended: true }));
    app.set('json spaces', 2);
};
