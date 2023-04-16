import B2 from 'backblaze-b2';
import config from 'config';
import { Notifications, notificationsValidationSchema } from '@/models/NotificationsSchema';
import Path from 'path';
import _ from 'lodash';
import { readFileSync } from 'fs';
import { dbConnect, dbDisconnect } from '@/startup/dbConnect';

if (process.argv.length < 3) {
    console.log(
        'Usage: node -r tsconfig-paths/register -r ts-node/register ./src/utils/pushNotificationsToDb.ts ./python-scripts/2312135_notifications.json'
    );
}

const filename = process.argv[2];
const gameId = Path.parse(filename).name.split('_')[0];

storeNotifications(filename, gameId);

async function storeNotifications(filename: string, gameId: string) {
    const baseUrl = await getBackblazeBaseUrl();

    const raw = readFileSync(filename, 'utf8');
    const notifications = JSON.parse(raw);
    notifications.forEach((notification) => {
        if (notification.img) notification.img = `${baseUrl}/file/kicksmarter/${gameId}/${notification.img}`;
    });
    const toStore = { gameId, notifications };

    const validationResult = notificationsValidationSchema.validate(toStore);
    if (validationResult.error) {
        console.log(`Validation error: ${validationResult.error.message}`);
        return;
    }

    console.log('Validation complete!');

    await dbConnect(config.get<string>('MONGODB_NAME_DATA'));
    const storeNotifications = new Notifications(toStore);
    await storeNotifications.save();
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
