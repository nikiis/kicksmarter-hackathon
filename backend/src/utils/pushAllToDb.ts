import { readFileSync } from 'fs';
import config from 'config';
import { Game, gameValidationSchema } from '@/models/GameSchema';
import { dbConnect, dbDisconnect } from '@/startup/dbConnect';

if (process.argv.length < 4) {
    // note that the script has to be run from root of backend!
    //
    console.log(
        'Usage: node -r tsconfig-paths/register -r ts-node/register ./src/utils/pushAllToDb.ts ./python-scripts/2312135_meta_data.json ./python-scripts/2312135_frames.json'
    );
    process.exit(1);
}

const filenameMeta = process.argv[2];
const filenameFrames = process.argv[3];
storeGameData(filenameMeta, filenameFrames);

async function storeGameData(filenameMeta: string, filenameFrames: string) {
    const connection = await dbConnect(config.get<string>('MONGODB_NAME_DATA'));

    const rawMeta = readFileSync(filenameMeta, 'utf8');
    const rawFrames = readFileSync(filenameFrames, 'utf8');
    const meta = JSON.parse(rawMeta);
    const frames = JSON.parse(rawFrames);

    // console.log(meta);
    // console.log(frames[0]);

    meta['frames'] = frames;

    const validationResult = gameValidationSchema.validate(meta);
    if (validationResult.error) {
        console.log(`Validation error: ${validationResult.error.message}`);
        return;
    }

    console.log('Validation complete!');

    const newGame = new Game(meta);

    console.log('Created the game data object!');

    await newGame.save();

    console.log('Complete!');

    await dbDisconnect();
}
