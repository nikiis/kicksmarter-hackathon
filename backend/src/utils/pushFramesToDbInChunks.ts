import { readFileSync } from 'fs';
import config from 'config';
import { Frame, FramesChunk, framesChunkValidationSchema } from '@/models/FrameSchema';
import { dbConnect, dbDisconnect } from '@/startup/dbConnect';
import Path from 'path';
import _ from 'lodash';

if (process.argv.length < 3) {
    // note that the script has to be run from root of backend!
    //
    console.log(
        'Usage: node -r tsconfig-paths/register -r ts-node/register ./src/utils/pushFramesToDb.ts ./python-scripts/2312135_frames.json chunkSize\nwhere chunkSize is the selected frames chunk size in the range 1000.'
    );
    process.exit(1);
}

const filename = process.argv[2];
const chunkSize = parseInt(process.argv[3]);
const gameId = Path.parse(filename).name.split('_')[0];
storeFrames(filename, chunkSize, gameId);

async function storeFrames(filename: string, chunkSize: number, gameId: string) {
    const raw = readFileSync(filename, 'utf8');
    const allFrames = JSON.parse(raw);

    await dbConnect(config.get<string>('MONGODB_NAME_DATA'));

    const framesInChunks = _.chunk(allFrames, chunkSize);

    for (let chunkIdx = 0; chunkIdx < framesInChunks.length; chunkIdx++) {
        const frames = framesInChunks[chunkIdx];

        const chunk = {
            chunkIdx,
            gameId,
            frames,
        };

        const validationResult = framesChunkValidationSchema.validate(chunk);
        if (validationResult.error) {
            console.log(`Validation error: ${validationResult.error.message}`);
            process.exit(1);
        }

        console.log(`Validated chunkIdx: ${chunkIdx}`);

        const result = await FramesChunk.collection.insertOne(chunk);

        console.log(`Inserted chunk ${chunkIdx} id: ${result.insertedId}`);
    }

    console.log('Complete!');

    await dbDisconnect();
}
