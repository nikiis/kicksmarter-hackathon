import { readFileSync } from 'fs';
import config from 'config';
import { Game, gameValidationSchema } from '@/models/GameSchema';
import { Frame, frameValidationSchema } from '@/models/FrameSchema';
import { dbConnect, dbDisconnect } from '@/startup/dbConnect';
import Path from 'path';

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

    // const frameObjs = [];
    for (const frame of frames) {
        const validationResult = frameValidationSchema.validate(frame);
        if (validationResult.error) {
            console.log(`Validation error: ${validationResult.error.message}`);
            process.exit(1);
        }

        // frameObjs.push(new Frame(frame));
    }

    console.log('Validation complete!');
    const connection = await dbConnect(config.get<string>('MONGODB_NAME_DATA'));

    await Game.updateOne(
        { gameId },
        {
            $push: { frames: { $each: frames } },
        }
    );

    console.log('Complete!');

    await dbDisconnect();
}
