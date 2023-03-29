import { Game } from '@/models/GameSchema';
import Joi from 'joi';
import { GraphQLResolveInfo } from 'graphql';

import { GraphQLError } from 'graphql';

export const resolvers = {
    Query: {
        game: async (parent: any, args: any, context: any, info: GraphQLResolveInfo) => {
            const { error, value } = validateGameRequest(args);
            console.log(value);
            console.log(error);

            if (error) throw new GraphQLError(error.details[0].message);

            return await Game.findOne({ gameId: value.gameId }).select('-frames');
        },
        allGames: async () => {
            return await Game.find().select('-frames');
        },
    },
};

function validateGameRequest(data: any) {
    const schema = Joi.object({
        gameId: Joi.string().min(0).max(20).required(),
    });

    return schema.validate(data);
}
