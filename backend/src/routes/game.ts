import { Router, Request, Response } from 'express';
import { Game } from '@/models/GameSchema';
import Joi from 'joi';
import winston from 'winston';

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

    // frameIdx provided, use that
    if (value.frameIdx) {
        const frame = await Game.findOne(
            { gameId: value.gameId },
            { frames: { $elemMatch: { frameIdx: value.frameIdx } } }
        ).select('-_id');

        if (frame) return res.json(frame.frames[0]);
        return res.json(frame);
    }

    // gameClock provided
    const baseFps = await Game.findOne({ gameId: value.gameId }).select('fps');

    // TODO: use winston to report, do not cause error?
    if (!baseFps) return res.status(400).json({ message: 'Cannot find FPS' });

    const frameIdx = Math.round(value.gameClock * baseFps.get('fps'));

    const frame = await Game.findOne(
        { gameId: value.gameId },
        { frames: { $elemMatch: { frameIdx: frameIdx } } }
    ).select('-_id');

    if (frame) return res.json(frame.frames[0]);
    return res.json(frame);
});

function validateFrameRequest(data: any) {
    const schema = Joi.object({
        gameId: Joi.string().min(0).max(20).required(),
        frameIdx: Joi.number()
            .min(1)
            .max(9000 * 25),
        gameClock: Joi.number().min(0).max(9000),
    })
        .or('frameIdx', 'gameClock')
        .required();

    return schema.validate(data);
}

export default router;
