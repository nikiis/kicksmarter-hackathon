import { Router, Request, Response } from 'express';
import { Game } from '@/models/GameSchema';
import Joi from 'joi';
import { Frame } from '@/models/FrameSchema';

const router = Router();

router.get('/all', async (req: Request, res: Response) => {
    const games = await Game.find().select('-_id -__v -fps -home -away -frames -periods._id');
    res.json(games);
});

router.get('/players', async (req: Request, res: Response) => {
    const { error, value } = validatePlayersRequest(req.body);

    if (error) return res.status(400).json({ message: error.details[0].message });

    // todo: remove individual player ids from both home and away
    // This didn't work: -home.players._id -away.players._id
    const players = await Game.findOne({ gameId: value.gameId }).select('-_id gameId home away');
    res.json(players);
});

router.get('/frame', async (req: Request, res: Response) => {
    const { error, value } = validateFrameRequest(req.body);

    if (error) return res.status(400).json({ message: error.details[0].message });

    const baseFps = await Game.findOne({ gameId: value.gameId }).select('fps');

    if (!baseFps) return res.status(400).json({ message: 'Cannot find FPS' });

    const frameIdx = value.gameClock * value.fps * baseFps.get('fps');

    const frame = await Game.findOne(
        { gameId: value.gameId },
        { frames: { $elemMatch: { frameIdx: frameIdx } } }
    ).select('-_id');
    res.json(frame);
});

function validateFrameRequest(data: any) {
    const schema = Joi.object({
        gameId: Joi.number().min(0).max(9999999999).required(),
        gameClock: Joi.number().min(0).max(9000).required(),
        fps: Joi.number().min(1).max(25).required(),
    });

    return schema.validate(data);
}

function validatePlayersRequest(data: any) {
    const schema = Joi.object({
        gameId: Joi.number().min(0).max(9999999999).required(),
    });

    return schema.validate(data);
}

export default router;

// {
//     "gameId": "2312213",
//     "description": "MCI-W - TOT-W : 2023-3-5",
//     "startTime": 1678024891160,
//     "pitchLength": 105.1736831665039,
//     "pitchWidth": 68.15968322753906,
//     "fps": 25.0,
//     "frames": [
//         {
//             "period": 1,
//             "frameIdx": 0,
//             "gameClock": 0.0,
//             "wallClock": 1678024891160
//         }
//     ]
// }
