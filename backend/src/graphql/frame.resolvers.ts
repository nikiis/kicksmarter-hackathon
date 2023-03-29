import { Game } from '@/models/GameSchema';
import Joi from 'joi';
import { GraphQLResolveInfo } from 'graphql';
import { GraphQLError } from 'graphql';

export const resolvers = {
    Query: {
        frame: async (parent: any, args: any, context: any, info: GraphQLResolveInfo) => {
            const { error, value } = validateFrameRequest(args);

            if (error) throw new GraphQLError(error.details[0].message);

            const frameIdx = value.frameIdx ?? (await frameIdxFromGameClock(value.gameId, value.gameClock));

            return (await findFrames(value.gameId, frameIdx, frameIdx))[0];
        },

        frames: async (parent: any, args: any, context: any, info: GraphQLResolveInfo) => {
            const { error, value } = validateFramesRequest(args);

            if (error) throw new GraphQLError(error.details[0].message);

            const startFrameIdx =
                value.startFrameIdx ?? (await frameIdxFromGameClock(value.gameId, value.startGameClock));

            const stopFrameIdx = value.stopFrameIdx ?? (await frameIdxFromGameClock(value.gameId, value.stopGameClock));

            return await findFrames(value.gameId, startFrameIdx, stopFrameIdx);
        },
    },
};

async function frameIdxFromGameClock(gameId: String, gameClock: number) {
    const baseFps = await Game.findOne({ gameId: gameId }).select('fps');

    if (!baseFps) throw new GraphQLError('Cannot find FPS field within database!');

    return Math.round(gameClock * baseFps.get('fps'));
}

async function findFrames(gameId: String, startFrameIdx: number, stopFrameIdx: number): Promise<any> {
    const game = await Game.findOne({ gameId });
    return game?.frames.slice(startFrameIdx, stopFrameIdx + 1);
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

function validateFramesRequest(data: any) {
    const schema = Joi.object({
        gameId: Joi.string().min(0).max(20).required(),
        startFrameIdx: Joi.number()
            .min(0)
            .max(9000 * 25),
        stopFrameIdx: Joi.number()
            .min(0)
            .max(9000 * 25)
            .greater(Joi.ref('startFrameIdx'))
            .when('startFrameIdx', {
                is: Joi.exist(),
                then: Joi.required(),
                otherwise: Joi.optional(),
            }),
        startGameClock: Joi.number().min(0).max(9000),
        stopGameClock: Joi.number()
            .min(0)
            .max(9000)
            .when('startGameClock', {
                is: Joi.exist(),
                then: Joi.number().greater(Joi.ref('startGameClock')).required(),
                otherwise: Joi.optional(),
            }),
    }).or('startFrameIdx', 'startGameClock');

    return schema.validate(data);
}
