import B2 from 'backblaze-b2';
import config from 'config';
import { LiveFeeds, liveFeedsValidationSchema } from '@/models/LiveFeedSchema';
import Path from 'path';
import _ from 'lodash';
import { readFileSync } from 'fs';
import { dbConnect, dbDisconnect } from '@/startup/dbConnect';

if (process.argv.length < 3) {
    console.log(
        'Usage: node -r tsconfig-paths/register -r ts-node/register ./src/utils/pushLiveFeedsToDb.ts ./python-scripts/2312135_live_feeds.json'
    );
}

const filename = process.argv[2];
const gameId = Path.parse(filename).name.split('_')[0];

storeLiveFeeds(filename, gameId);

async function storeLiveFeeds(filename: string, gameId: string) {
    const baseUrl = await getBackblazeBaseUrl();

    const raw = readFileSync(filename, 'utf8');
    const liveFeeds = JSON.parse(raw);
    liveFeeds.forEach((feed) => {
        const imgs = feed.imgs.map((img) => `${baseUrl}/file/kicksmarter/${gameId}/${img}`);
        feed.imgs = imgs;
    });

    const toStore = { gameId, liveFeeds };

    const validationResult = liveFeedsValidationSchema.validate(toStore);
    if (validationResult.error) {
        console.log(`Validation error: ${validationResult.error.message}`);
        return;
    }

    console.log('Validation complete!');

    await dbConnect(config.get<string>('MONGODB_NAME_DATA'));
    const newFeeds = new LiveFeeds(toStore);
    await newFeeds.save();
    await dbDisconnect();

    console.log('Complete!');
}

async function getBackblazeBaseUrl() {
    const b2 = new B2({
        applicationKeyId: config.get<string>('B2_APP_KEY_ID'),
        applicationKey: config.get<string>('B2_APP_KEY'),
    });

    try {
        const authRes = await b2.authorize(); // must authorize first (authorization lasts 24 hrs)
        return authRes.data.downloadUrl;
    } catch (err) {
        console.log('Error getting bucket:', err);
    }
}
