import winston from 'winston';
import mongoose, { ConnectOptions } from 'mongoose';

export default () => {
    if (mongoose.connection.readyState >= 1) {
        winston.info(`Already connected to ${mongoose.connection.name}`);
        return;
    }

    const db = process.env.MONGODB_URI;

    if (!db) {
        winston.error('Add MONGODB_URI into .env.local');
        return;
    }

    const options: ConnectOptions = {
        dbName: 'kicksmarter',
    };

    return mongoose.connect(db, options).then(() => winston.info(`Connected to ${db}`));
};
