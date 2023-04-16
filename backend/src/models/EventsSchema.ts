import Joi from 'joi';
import { Schema, model } from 'mongoose';

const EventSchema = new Schema(
    {
        gameClock: { type: Number, required: true },
        optaId: { type: String, required: true },
        team: { type: String, required: true },
        xG: { type: Number, required: true },
        length: { type: Number, required: true },
    },
    { _id: false }
);

const EventsSchema = new Schema(
    {
        shots: [EventSchema],
        goals: [EventSchema],
        progressiveCarries: [EventSchema],
        progressivePasses: [EventSchema],
        keyPasses: [EventSchema],
    },
    { _id: false }
);

const eventValidationSchema = Joi.object({
    gameClock: Joi.number().required(),
    optaId: Joi.string().required(),
    team: Joi.string().required(),
    xG: Joi.number(),
    length: Joi.number(),
});

const eventsValidationSchema = Joi.object({
    shots: Joi.array().items(eventValidationSchema),
    goals: Joi.array().items(eventValidationSchema),
    progressiveCarries: Joi.array().items(eventValidationSchema),
    progressivePasses: Joi.array().items(eventValidationSchema),
    keyPasses: Joi.array().items(eventValidationSchema),
});

export { EventsSchema, eventsValidationSchema };
