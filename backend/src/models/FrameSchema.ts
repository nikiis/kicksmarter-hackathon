import Joi from 'joi';
import mongoose from 'mongoose';

const PlayerSchema = new mongoose.Schema(
    {
        number: Number,
        xy: [Number],
        speed: Number,
        optaId: String,
    },
    { _id: false }
);

const BallSchema = new mongoose.Schema(
    {
        xyz: [Number],
        speed: Number,
    },
    { _id: false }
);

const FrameSchema = new mongoose.Schema(
    {
        period: Number,
        frameIdx: Number,
        gameClock: Number,
        homePlayers: [PlayerSchema],
        awayPlayers: [PlayerSchema],
        ball: BallSchema,
        live: Boolean,
        lastTouch: String,
    },
    { collection: 'frames' }
);

const Frame = mongoose.model('FrameSchema', FrameSchema);

const playerValidationSchema = Joi.object({
    number: Joi.number().required(),
    xy: Joi.array().length(2).items(Joi.number()).required(),
    speed: Joi.number().required(),
    optaId: Joi.string().required(),
});

const ballValidationSchema = Joi.object({
    xyz: Joi.array().length(3).items(Joi.number()).required(),
    speed: Joi.number().required(),
});

const frameValidationSchema = Joi.object({
    period: Joi.number().required(),
    frameIdx: Joi.number().required(),
    gameClock: Joi.number().required(),
    homePlayers: Joi.array().items(playerValidationSchema).required(),
    awayPlayers: Joi.array().items(playerValidationSchema).required(),
    ball: ballValidationSchema.required(),
    live: Joi.boolean().required(),
    lastTouch: Joi.string().required(),
});

const framesValidationSchema = Joi.object({
    frames: Joi.array().items(frameValidationSchema).required(),
});

export { Frame, FrameSchema, frameValidationSchema, framesValidationSchema };
