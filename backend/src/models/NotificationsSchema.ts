import { Schema, model } from 'mongoose';
import Joi from 'joi';

const NotificationSchema = new Schema(
    {
        gameClock: { type: Number, required: true },
        message: { type: String, required: true },
        team: { type: String, required: true },
        imgs: [String],
    },
    { _id: false }
);

const NotificationsSchema = new Schema({
    gameId: { type: String, required: true },
    notifications: { type: [NotificationSchema], required: true },
});

const notificationValidationSchema = Joi.object({
    gameClock: Joi.number().required(),
    message: Joi.string().required(),
    team: Joi.string().required(),
    imgs: Joi.array().items(Joi.string()).allow(null),
});

const notificationsValidationSchema = Joi.object({
    gameId: Joi.string().required(),
    notifications: Joi.array().items(notificationValidationSchema).required(),
});

const Notifications = model('Notification', NotificationsSchema);

export { Notifications, notificationsValidationSchema, notificationValidationSchema };
