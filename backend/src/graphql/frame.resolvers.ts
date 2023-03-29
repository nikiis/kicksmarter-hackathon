import { Game } from '@/models/GameSchema';
import Joi from 'joi';
import { GraphQLResolveInfo } from 'graphql';
import { GraphQLError } from 'graphql';
import _ from 'lodash';

export const resolvers = {
    Query: {
        frame: async (parent: any, args: any, context: any, info: GraphQLResolveInfo) => {
            const { error, value } = validateFrameRequest(args);

            if (error) throw new GraphQLError(error.details[0].message);

            const frameIdx = value.frameIdx ?? (await frameIdxFromGameClock(value.gameId, value.gameClock));

            return await findFrame(value.gameId, frameIdx);
        },

        frames: async (parent: any, args: any, context: any, info: GraphQLResolveInfo) => {
            const { error, value } = validateFramesRequest(args);

            if (error) throw new GraphQLError(error.details[0].message);

            const startFrameIdx =
                value.startFrameIdx ?? (await frameIdxFromGameClock(value.gameId, value.startGameClock));

            const stopFrameIdx = value.stopFrameIdx ?? (await frameIdxFromGameClock(value.gameId, value.stopGameClock));

            const frames = await findFrames(value.gameId, startFrameIdx, stopFrameIdx);

            // console.log(frames);

            return frames;
        },
    },
};

async function frameIdxFromGameClock(gameId: String, gameClock: number) {
    const baseFps = await Game.findOne({ gameId: gameId }).select('fps');

    if (!baseFps) throw new GraphQLError('Cannot find FPS field within database!');

    return Math.round(gameClock * baseFps.get('fps'));
}

async function findFrame(gameId: String, frameIdx: number) {
    return (await Game.findOne({ gameId }, { frames: { $elemMatch: { frameIdx } } }))?.frames[0];
}

async function findFrames(gameId: String, startFrameIdx: number, stopFrameIdx: number): Promise<any> {
    // TODO: improve the speed here when trying to get large number of frames
    // If getting all the data and then slicing, it takes around 0.5s per query, which is unaccptable
    // However I cannot seem to be able to write a mongoose query that would return all wanted frames
    // that is why I am calling multiple call on getting a single frame, which uses a mongoose query
    // return _.range(startFrameIdx, stopFrameIdx + 1).map(async (idx) => await findFrame(gameId, idx));

    const result = await Game.aggregate([
        { $match: { gameId } },
        {
            $project: {
                frames: {
                    $filter: {
                        input: '$frames',
                        as: 'frame',
                        cond: {
                            $and: [
                                { $gte: ['$$frame.frameIdx', startFrameIdx] },
                                { $lte: ['$$frame.frameIdx', stopFrameIdx] },
                            ],
                        },
                    },
                },
            },
        },
    ]);

    // console.log(result[0].frames);
    return result[0].frames;
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
