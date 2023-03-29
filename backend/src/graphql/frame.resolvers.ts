import { Game } from '@/models/GameSchema';
import Joi from 'joi';
import { GraphQLResolveInfo } from 'graphql';

import { GraphQLError } from 'graphql';

export const resolvers = {
    Query: {
        frame: async (parent: any, args: any, context: any, info: GraphQLResolveInfo) => {
            const { error, value } = validateFrameRequest(args);

            if (error) throw new GraphQLError(error.details[0].message);

            if (value.frameIdx) {
                const frame = await Game.findOne(
                    { gameId: value.gameId },
                    { frames: { $elemMatch: { frameIdx: value.frameIdx } } }
                );

                return frame;
            }
        },
    },
};

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
