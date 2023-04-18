import { Game } from '@/models/GameSchema';
import { FramesChunk } from '@/models/FrameSchema';
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

            return await findFrames(value.gameId, startFrameIdx, stopFrameIdx);
        },
    },
};

async function frameIdxFromGameClock(gameId: String, gameClock: number) {
    const game = await Game.findOne({ gameId }).select('fps');

    if (!game) throw new GraphQLError('Cannot find fps and/or baseFps fields within game!');

    return Math.round(gameClock * game.fps);
}

async function findFrame(gameId: String, frameIdx: number) {
    const chunkSize = await getChunkSize(gameId);
    const chunkIdx = Math.floor(frameIdx / chunkSize);

    const result = await FramesChunk.aggregate([
        { $match: { gameId } },
        { $match: { chunkIdx } },
        {
            $project: {
                frame: {
                    $filter: {
                        input: '$frames',
                        as: 'frame',
                        cond: { $eq: ['$$frame.frameIdx', frameIdx] },
                    },
                },
            },
        },
    ]);

    return result[0].frame[0];
}

async function findFrames(gameId: String, startFrameIdx: number, stopFrameIdx: number): Promise<any> {
    const chunkSize = await getChunkSize(gameId);
    const startChunkIdx = Math.floor(startFrameIdx / chunkSize);
    const stopChunkIdx = Math.floor(stopFrameIdx / chunkSize);

    const result = await FramesChunk.aggregate([
        { $match: { gameId } },
        {
            $match: {
                chunkIdx: {
                    $in: _.range(startChunkIdx, stopChunkIdx + 1),
                },
            },
        },
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

    const frames = _.flatten(result.map((res) => res.frames));
    return frames;
}

async function getChunkSize(gameId: String) {
    const game = await Game.findOne({ gameId }).select('framesChunkSize');

    if (!game) throw new GraphQLError('Cannot find framesChunkSize fields within game!');

    return game.framesChunkSize;
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
    // todo probably can now remove requesting specific index, on top of that would be good to prevent user from requesting more than 1 min of data?
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
