import Joi from 'joi';
import mongoose from 'mongoose';
import { PlayerSchema, playerValidationSchema } from '@/models/PlayerSchema';

const PeriodSchema = new mongoose.Schema(
    {
        number: { type: Number, required: true },
        startFrameClock: { type: Number, required: true },
        endFrameClock: { type: Number, required: true },
        startFrameIdx: { type: Number, required: true },
        endFrameIdx: { type: Number, required: true },
        homeAttPositive: { type: Boolean, required: true },
    },
    { _id: false }
);

const EventSchema = new mongoose.Schema(
    {
        period: { type: Number, required: true },
        gameClock: { type: Number, required: true },
        type: { type: String, required: true },
        outcome: { type: String, required: true },
    },
    { _id: false }
);

const TeamSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        color: { type: String, required: true },
        score: { type: Number, required: true },
        players: [PlayerSchema],
        events: [EventSchema],
    },
    { _id: false }
);

const GameSchema = new mongoose.Schema(
    {
        gameId: { type: String, required: true },
        description: { type: String, required: true },
        startTime: { type: Number, required: true },
        pitchLength: { type: Number, required: true },
        pitchWidth: { type: Number, required: true },
        fps: { type: Number, required: true },
        baseFps: { type: Number, required: true },
        periods: [PeriodSchema],
        home: TeamSchema,
        away: TeamSchema,
    },
    { collection: 'games' }
);

const periodValidationSchema = Joi.object({
    number: Joi.number().required(),
    startFrameClock: Joi.number().required(),
    endFrameClock: Joi.number().required(),
    startFrameIdx: Joi.number().required(),
    endFrameIdx: Joi.number().required(),
    homeAttPositive: Joi.boolean().required(),
});

const eventValidationSchema = Joi.object({
    period: Joi.number().required(),
    gameClock: Joi.number().required(),
    type: Joi.string().required(),
    outcome: Joi.string().required(),
});

const teamValidationSchema = Joi.object({
    name: Joi.string().required(),
    color: Joi.string().required(),
    score: Joi.number().required(),
    players: Joi.array().items(playerValidationSchema).required(),
    events: Joi.array().items(eventValidationSchema).required(),
});

const gameValidationSchema = Joi.object({
    gameId: Joi.string().required(),
    description: Joi.string().required(),
    startTime: Joi.number().required(),
    pitchLength: Joi.number().required(),
    pitchWidth: Joi.number().required(),
    fps: Joi.number().required(),
    baseFps: Joi.number().required(),
    periods: Joi.array().items(periodValidationSchema).required(),
    home: teamValidationSchema.required(),
    away: teamValidationSchema.required(),
});

const Game = mongoose.model('Game', GameSchema);

export { Game, GameSchema, gameValidationSchema };
