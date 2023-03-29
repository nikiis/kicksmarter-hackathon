import { Game } from '@/models/GameSchema';
import Joi from 'joi';
import { GraphQLResolveInfo } from 'graphql';

import { GraphQLError } from 'graphql';

export const resolvers = {
    Query: {
        game: async (parent: any, args: any, context: any, info: GraphQLResolveInfo) => {
            const { error, value } = validateGameRequest(args);

            if (error) throw new GraphQLError(error.details[0].message);

            if (value.gameId) return await Game.findOne({ gameId: value.gameId });

            return await Game.findById(value.id);
        },
        allGames: async () => {
            return await Game.find().select('-frames');
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
