import { Game } from '@/models/GameSchema';
import Joi from 'joi';
import { GraphQLResolveInfo } from 'graphql';
import _ from 'lodash';

import { GraphQLError } from 'graphql';

export const resolvers = {
    Query: {
        events: async (parent: any, args: any, context: any, info: GraphQLResolveInfo) => {
            const { error, value } = validateEventRequest(args);

            if (error) throw new GraphQLError(error.details[0].message);

            const data = await Game.findOne({ gameId: value.gameId }).select('events home away').lean();

            if (!data) return null;

            const type = _.camelCase(value.type);
            let events = data.events[type];
            events.forEach((event: any) => {
                const team = data[event.team];
                const player = team.players.find((p: any) => p.optaId === event.optaId);

                event.team = team;
                event.player = player;
            });

            return events;
        },
    },
};

function validateEventRequest(data: any) {
    const schema = Joi.object({
        gameId: Joi.string().min(0).max(20).required(),
        type: Joi.string().min(0).max(30).required(),
    });

    return schema.validate(data);
}
