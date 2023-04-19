import { LiveFeeds } from '@/models/LiveFeedSchema';
import Joi from 'joi';
import { GraphQLResolveInfo } from 'graphql';
import _ from 'lodash';

import { GraphQLError } from 'graphql';

export const resolvers = {
    Query: {
        allLiveFeeds: async (parent: any, args: any, context: any, info: GraphQLResolveInfo) => {
            const { error, value } = validateAllLiveFeedRequest(args);

            if (error) throw new GraphQLError(error.details[0].message);

            const game = await LiveFeeds.findOne({ gameId: value.gameId });

            return game?.liveFeeds;
        },
        liveFeed: async (parent: any, args: any, context: any, info: GraphQLResolveInfo) => {
            const { error, value } = validateLiveFeedRequest(args);

            if (error) throw new GraphQLError(error.details[0].message);

            const liveFeed = await findLiveFeed(value.gameId, value.gameClock);

            return liveFeed;
        },
    },
};

async function findLiveFeed(gameId: String, gameClock: number) {
    const result = await LiveFeeds.aggregate([
        { $match: { gameId } },
        {
            $project: {
                liveFeed: {
                    $filter: {
                        input: '$liveFeed',
                        as: 'liveFeed',
                        cond: { $eq: ['$$liveFeed.gameClock', gameClock] },
                    },
                },
            },
        },
    ]);

    return result[0].liveFeed[0];
}

function validateAllLiveFeedRequest(data: any) {
    const schema = Joi.object({
        gameId: Joi.string().min(0).max(20).required(),
    });

    return schema.validate(data);
}

function validateLiveFeedRequest(data: any) {
    const schema = Joi.object({
        gameId: Joi.string().min(0).max(20).required(),
        gameClock: Joi.number().min(0).required(),
    });

    return schema.validate(data);
}
