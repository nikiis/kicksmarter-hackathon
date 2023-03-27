import { readFileSync } from 'fs';
import config from 'config';
import { Game, gameValidationSchema } from '@/models/GameSchema';
import { dbConnect, dbDisconnect } from '@/startup/dbConnect';

if (process.argv.length < 3) {
    // note that the script has to be run from root of backend!
    // node -r tsconfig-paths/register -r ts-node/register ./src/utils/pushGameDataToDb.ts ./python-scripts/2312135_complete.json
    console.log('Usage: node pushFrameToDb.js <filename>.json');
    process.exit(1);
}

const filename = process.argv[2];
storeGameData(filename);

async function storeGameData(filename: string) {
    const connection = await dbConnect(config.get<string>('MONGODB_NAME_DATA'));

    const raw = readFileSync(filename, 'utf8');
    const gameData = JSON.parse(raw);

    const validationResult = gameValidationSchema.validate(gameData);
    if (validationResult.error) {
        console.log(`Validation error: ${validationResult.error.message}`);
        return;
    }

    const newGame = new Game(gameData);
    await newGame.save();
    console.log('Complete!');

    await dbDisconnect();
}
