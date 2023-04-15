import { readFileSync } from 'fs';
import config from 'config';
import { Events, eventsValidationSchema } from '@/models/EventsSchema';
import { Game } from '@/models/GameSchema';
import { dbConnect, dbDisconnect } from '@/startup/dbConnect';
import Path from 'path';

if (process.argv.length < 4) {
    // Run the script from root of backend!
    console.log(
        'Usage: node -r tsconfig-paths/register -r ts-node/register ./src/utils/pushEventsToDb.ts ./python-scripts/2312213_events.json'
    );
    process.exit(1);
}

const filename = process.argv[2];
const gameId = Path.parse(filename).name.split('_')[0];

storeGameData(filename, gameId);

async function storeGameData(filename: string, gameId: string) {
    await dbConnect(config.get<string>('MONGODB_NAME_DATA'));

    const raw = readFileSync(filename, 'utf8');
    const eventsData = JSON.parse(raw);

    const validationResult = eventsValidationSchema.validate(eventsData);
    if (validationResult.error) {
        console.log(`Validation error: ${validationResult.error.message}`);
    } else {
        console.log('Validation complete!');

        await Game.findOneAndUpdate({ gameId }, { events: eventsData });
    }

    console.log('Complete!');
    await dbDisconnect();
}
