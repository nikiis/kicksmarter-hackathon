import winston from 'winston';
import { Request, Response, NextFunction } from 'express';

export default (err: any, req: Request, res: Response, next: NextFunction) => {
    winston.error(err.message, err);

    // error
    // warn
    // info
    // verbose
    // debug
    // silly

    res.status(500).json({ message: 'Something failed.' });
};
