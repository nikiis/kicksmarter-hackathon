import { Game } from '@/models/GameSchema';
import Joi from 'joi';
import { GraphQLResolveInfo } from 'graphql';
import _ from 'lodash';

import { GraphQLError } from 'graphql';

export const resolvers = {
    Query: {
        allGames: async () => {
            return await Game.find().select('-frames');
        },
        game: async (parent: any, args: any, context: any, info: GraphQLResolveInfo) => {
            const { error, value } = validateGameRequest(args);

            if (error) throw new GraphQLError(error.details[0].message);

            if (value.gameId) return await Game.findOne({ gameId: value.gameId }).select('-frames');

            return await Game.findById(value.id).select('-frames');
        },
        player: async (parent: any, args: any, context: any, info: GraphQLResolveInfo) => {
            const { error, value } = validatePlayerRequest(args);

            if (error) throw new GraphQLError(error.details[0].message);

            const game = await Game.findOne({ gameId: value.gameId }).select('-frames');

            const players = _.merge(game?.away?.players, game?.home?.players);

            return players?.find((p) => p.optaId === value.optaId);
        },
    },
};

function validateGameRequest(data: any) {
    const schema = Joi.object({
        gameId: Joi.string().min(0).max(20),
        id: Joi.string().hex().length(24),
    }).or('gameId', 'id');

    return schema.validate(data);
}

function validatePlayerRequest(data: any) {
    const schema = Joi.object({
        gameId: Joi.string().min(0).max(20),
        optaId: Joi.string().min(0).max(20),
    }).or('gameId', 'id');

    return schema.validate(data);
}
