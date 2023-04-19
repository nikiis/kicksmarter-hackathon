import { Schema, model } from 'mongoose';
import Joi from 'joi';

const LiveFeedSchema = new Schema(
    {
        gameClock: { type: Number, required: true },
        name: { type: String, required: true },
        message: { type: String, required: true },
        team: { type: String, required: true },
        imgs: [String],
    },
    { _id: false }
);

const LiveFeedsSchema = new Schema({
    gameId: { type: String, required: true },
    liveFeeds: { type: [LiveFeedSchema], required: true },
});

const liveFeedValidationSchema = Joi.object({
    gameClock: Joi.number().required(),
    name: Joi.string().required(),
    message: Joi.string().required(),
    team: Joi.string().required(),
    imgs: Joi.array().items(Joi.string()).allow(null),
});

const liveFeedsValidationSchema = Joi.object({
    gameId: Joi.string().required(),
    liveFeeds: Joi.array().items(liveFeedValidationSchema).required(),
});

const LiveFeeds = model('LiveFeed', LiveFeedsSchema);

export { LiveFeeds, liveFeedsValidationSchema, liveFeedValidationSchema };
