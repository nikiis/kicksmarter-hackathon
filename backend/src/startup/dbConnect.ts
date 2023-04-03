import mongoose from 'mongoose';
import config from 'config';

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */

declare global {
    var mongoose: any; // This must be a `var` and not a `let / const`
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function dbDisconnect() {
    await mongoose.connection.close();
}

async function dbConnect(dbName: string) {
    if (!config.has('MONGODB_URI') && !process.env.MONGODB_URI) {
        throw new Error(
            'Please define the MONGODB_URI environment variable inside config/default.json or through env variable.'
        );
    }

    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            dbName,
        };

        cached.promise = mongoose
            .connect(process.env.MONGODB_URI ?? config.get<string>('MONGODB_URI'), opts)
            .then((mongoose) => {
                return mongoose;
            });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export { dbConnect, dbDisconnect };
