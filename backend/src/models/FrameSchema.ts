import Joi from 'joi';
import mongoose from 'mongoose';

const PlayerSchema = new mongoose.Schema(
    {
        number: { type: Number, required: true },
        xy: { type: [Number], required: true },
        speed: { type: Number, required: true },
        optaId: { type: String, required: true },
    },
    { _id: false }
);

const BallSchema = new mongoose.Schema(
    {
        xyz: { type: [Number], required: true },
        speed: { type: Number, required: true },
    },
    { _id: false }
);

const FrameSchema = new mongoose.Schema(
    {
        period: { type: Number, required: true },
        frameIdx: { type: Number, required: true },
        gameClock: { type: Number, required: true },
        homePlayers: { type: [PlayerSchema], required: true },
        awayPlayers: { type: [PlayerSchema], required: true },
        ball: { type: BallSchema, required: true },
        live: { type: Boolean, required: true },
        lastTouch: { type: String, required: true },
    },
    { _id: false }
);

const Frame = mongoose.model('FrameSchema', FrameSchema);

const FramesChunkSchema = new mongoose.Schema(
    {
        gameId: { type: String, required: true },
        chunkIdx: { type: Number, required: true },
        frames: { type: [FrameSchema], required: true },
    },
    { collection: 'frames' }
);

const FramesChunk = mongoose.model('FramesChunkSchema', FramesChunkSchema);

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

const framesChunkValidationSchema = Joi.object({
    gameId: Joi.string().required(),
    chunkIdx: Joi.number().required(),
    frames: Joi.array().items(frameValidationSchema).required(),
});

export { Frame, FrameSchema, FramesChunk, frameValidationSchema, framesValidationSchema, framesChunkValidationSchema };
