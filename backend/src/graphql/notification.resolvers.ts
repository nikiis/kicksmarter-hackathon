import { Notifications } from '@/models/NotificationsSchema';
import Joi from 'joi';
import { GraphQLResolveInfo } from 'graphql';
import _ from 'lodash';

import { GraphQLError } from 'graphql';

export const resolvers = {
    Query: {
        allNotifications: async (parent: any, args: any, context: any, info: GraphQLResolveInfo) => {
            const { error, value } = validateNotificationsRequest(args);

            if (error) throw new GraphQLError(error.details[0].message);

            const game = await Notifications.findOne({ gameId: value.gameId });

            return game?.notifications;
        },
        notification: async (parent: any, args: any, context: any, info: GraphQLResolveInfo) => {
            const { error, value } = validateNotificationRequest(args);

            if (error) throw new GraphQLError(error.details[0].message);

            const notifications = await findNotification(value.gameId, value.gameClock);

            return notifications;
        },
    },
};

async function findNotification(gameId: String, gameClock: number) {
    const result = await Notifications.aggregate([
        { $match: { gameId } },
        {
            $project: {
                notification: {
                    $filter: {
                        input: '$notifications',
                        as: 'notification',
                        cond: { $eq: ['$$notification.gameClock', gameClock] },
                    },
                },
            },
        },
    ]);

    return result[0].notification[0];
}

function validateNotificationsRequest(data: any) {
    const schema = Joi.object({
        gameId: Joi.string().min(0).max(20).required(),
    });

    return schema.validate(data);
}

function validateNotificationRequest(data: any) {
    const schema = Joi.object({
        gameId: Joi.string().min(0).max(20).required(),
        gameClock: Joi.number().min(0).required(),
    });

    return schema.validate(data);
}
