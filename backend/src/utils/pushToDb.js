import dbConnect from '@/src/startup/dbConnect';
import { readFile } from 'fs';
import util from 'util';
const readFilePromised = util.promisify(readFile);

dbConnect();

const data = await readFilePromised('match.json', 'utf8');

JSON.parse(data).levels.forEach((level) => {
    level.cards.forEach(async (card) => {
        const mongoCard = new Card({
            word: {
                value: card.word
            },
            meanings: {
                value: card.meanings
            },
            difficulty: level.difficulty
        });

        await mongoCard.save();
    });
    console.log(`Wrote difficulty: ${level.difficulty}`);
});

console.log('Finished!');