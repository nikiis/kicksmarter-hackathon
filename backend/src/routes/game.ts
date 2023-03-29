import { Router, Request, Response } from 'express';
import { Game } from '@/models/GameSchema';
import Joi from 'joi';
import winston from 'winston';
import _ from 'lodash';

const router = Router();

router.get('/all', async (req: Request, res: Response) => {
    const games = await Game.find().select('-_id -__v -fps -home -away -frames -periods._id');
    res.json(games);
});

router.get('/teams', async (req: Request, res: Response) => {
    const { error, value } = validatePlayersRequest(req.body);

    if (error) return res.status(400).json({ message: error.details[0].message });

    // todo: remove individual player ids from both home and away
    // This didn't work: -home.players._id -away.players._id
    const players = await Game.findOne({ gameId: value.gameId }).select('-_id gameId home away');
    res.json(players);
});

function validatePlayersRequest(data: any) {
    const schema = Joi.object({
        gameId: Joi.string().min(0).max(20).required(),
    });

    return schema.validate(data);
}

router.get('/frame', async (req: Request, res: Response) => {
    const { error, value } = validateFrameRequest(req.body);

    if (error) return res.status(400).json({ message: error.details[0].message });

    const frameIdx = value.frameIdx ?? (await frameIdxFromGameClock(value.gameId, value.gameClock, res));

    return res.json(await findFrame(value.gameId, frameIdx));
});

async function frameIdxFromGameClock(gameId: String, gameClock: number, res: Response) {
    const baseFps = await Game.findOne({ gameId: gameId }).select('fps');

    if (!baseFps) return res.status(400).json({ message: 'Cannot find FPS' });

    return Math.round(gameClock * baseFps.get('fps'));
}

async function findFrame(gameId: String, frameIdx: number) {
    return (await Game.findOne({ gameId }, { frames: { $elemMatch: { frameIdx } } }))?.frames[0];
}

async function findFrames(gameId: String, startFrameIdx: number, stopFrameIdx: number): Promise<any> {
    return _.range(startFrameIdx, stopFrameIdx + 1).map(async (idx) => await findFrame(gameId, idx));
}

function validateFrameRequest(data: any) {
    const schema = Joi.object({
        gameId: Joi.string().min(0).max(20).required(),
        frameIdx: Joi.number()
            .min(0)
            .max(9000 * 25),
        gameClock: Joi.number().min(0).max(9000),
    }).or('frameIdx', 'gameClock');

    return schema.validate(data);
}

export default router;
