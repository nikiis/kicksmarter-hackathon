import { readFileSync } from 'fs';
import config from 'config';
import { Game, gameValidationSchema } from '@/models/GameSchema';
import { Frame, frameValidationSchema } from '@/models/FrameSchema';
import { dbConnect, dbDisconnect } from '@/startup/dbConnect';
import Path from 'path';
import _ from 'lodash';
import mongoose, { Collection } from 'mongoose';

if (process.argv.length < 3) {
    // note that the script has to be run from root of backend!
    //
    console.log(
        'Usage: node -r tsconfig-paths/register -r ts-node/register ./src/utils/pushFramesToDb.ts ./python-scripts/2312135_frames.json'
    );
    process.exit(1);
}

const filename = process.argv[2];
const gameId = Path.parse(filename).name.split('_')[0];
storeFrames(filename, gameId);

async function storeFrames(filename: string, gameId: string) {
    const raw = readFileSync(filename, 'utf8');
    const frames = JSON.parse(raw);

    for (const frame of frames) {
        const validationResult = frameValidationSchema.validate(frame);
        if (validationResult.error) {
            console.log(`Validation error: ${validationResult.error.message}`);
            process.exit(1);
        }
    }

    console.log('Validation complete!');

    await dbConnect(config.get<string>('MONGODB_NAME_DATA'));

    const chunkSize = 5000;
    const framesInChunks = _.chunk(frames, chunkSize);

    for (let i = 0; i < framesInChunks.length; i++) {
        const chunk = framesInChunks[i];

        const result = await Frame.collection.insertOne({
            chunkId: i,
            gameId,
            chunkSize,
            frames: chunk,
        });

        console.log(`Inserted chunk ${i}: ${result.insertedId}`);
    }

    console.log('Complete!');

    await dbDisconnect();
}
