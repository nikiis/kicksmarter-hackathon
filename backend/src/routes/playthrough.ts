import { Router, Request, Response, ReqBody } from 'express';
import Joi from 'joi';
const router = Router();

router.get('/', async (req: Request, res: Response) => {
    /*
    gameId: 2312135
    gameClock: 0.0
    */

    const { error, value } = validatePlaythrough(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    // find the right game, find the right timestamp

    const gameMoment = await Playthrough.find({ difficulty: value.difficulty }).select('word.value meanings.value -_id');
    res.json(gameMoment);
});

function validatePlaythrough(data: ReqBody) {
    const schema = Joi.object({
        gameId: Joi.number().integer().min(0).max(10).required(),
        hameClock: Joi.number().min(0).required(),
    });

    return schema.validate(data);
}

export default router;
