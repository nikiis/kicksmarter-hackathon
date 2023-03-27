import Joi from 'joi';
import mongoose from 'mongoose';

const PlayerSchema = new mongoose.Schema({
    number: Number,
    xyz: [Number],
    speed: Number,
    optaId: Number,
    playerId: String,
});

const BallSchema = new mongoose.Schema({
    xyz: [Number],
    speed: Number,
});

const FrameSchema = new mongoose.Schema({
    period: Number,
    frameIdx: Number,
    gameClock: Number,
    wallClock: Number,
    homePlayers: [PlayerSchema],
    awayPlayers: [PlayerSchema],
    ball: BallSchema,
    live: Boolean,
    lastTouch: String,
});

const Frame = mongoose.model('FrameSchema', FrameSchema);

const playerValidationSchema = Joi.object({
    number: Joi.number().required(),
    xyz: Joi.array().length(3).items(Joi.number()).required(),
    speed: Joi.number().required(),
    optaId: Joi.number().required(),
    playerId: Joi.string().required(),
});

const ballValidationSchema = Joi.object({
    xyz: Joi.array().length(3).items(Joi.number()).required(),
    speed: Joi.number().required(),
});

const frameValidationSchema = Joi.object({
    period: Joi.number().required(),
    frameIdx: Joi.number().required(),
    gameClock: Joi.number().required(),
    wallClock: Joi.number().required(),
    homePlayers: Joi.array().items(playerValidationSchema).required(),
    awayPlayers: Joi.array().items(playerValidationSchema).required(),
    ball: ballValidationSchema.required(),
    live: Joi.boolean().required(),
    lastTouch: Joi.string().required(),
});

export { Frame, FrameSchema, frameValidationSchema };

// {"period": 1, "frameIdx": 0, "gameClock": 0.0, "homePlayers": [{"number": 25, "xy": [-11.08, 1.55], "speed": 0.0, "optaId": "192194"}, {"number": 9, "xy": [-0.15, -30.5], "speed": 0.0, "optaId": "174349"}, {"number": 7, "xy": [-2.71, 8.54], "speed": 0.0, "optaId": "96385"}, {"number": 1, "xy": [-46.26, 0.16], "speed": 0.0, "optaId": "186022"}, {"number": 12, "xy": [-1.2, -13.96], "speed": 0.0, "optaId": "191726"}, {"number": 21, "xy": [0.24, -0.45], "speed": 0.0, "optaId": "463306"}, {"number": 2, "xy": [-12.99, -23.0], "speed": 0.0, "optaId": "447080"}, {"number": 5, "xy": [-22.61, 7.47], "speed": 0.0, "optaId": "96535"}, {"number": 6, "xy": [-21.61, -8.56], "speed": 0.0, "optaId": "14772"}, {"number": 11, "xy": [-0.12, 24.02], "speed": 0.0, "optaId": "186043"}, {"number": 4, "xy": [-15.36, 17.27], "speed": 0.0, "optaId": "434287"}], "awayPlayers": [{"number": 12, "xy": [11.04, -4.63], "speed": 0.0, "optaId": "226718"}, {"number": 25, "xy": [-0.16, 9.02], "speed": 0.0, "optaId": "191720"}, {"number": 3, "xy": [22.64, 2.07], "speed": 0.0, "optaId": "186025"}, {"number": 6, "xy": [21.58, 13.47], "speed": 0.0, "optaId": "174345"}, {"number": 16, "xy": [16.6, 21.91], "speed": 0.0, "optaId": "205854"}, {"number": 7, "xy": [17.13, -21.1], "speed": 0.0, "optaId": "165678"}, {"number": 21, "xy": [6.39, 10.4], "speed": 0.0, "optaId": "444168"}, {"number": 10, "xy": [14.89, 5.64], "speed": 0.0, "optaId": "96380"}, {"number": 1, "xy": [48.48, -0.06], "speed": 0.0, "optaId": "174571"}, {"number": 19, "xy": [2.99, -13.72], "speed": 0.0, "optaId": "97094"}, {"number": 2, "xy": [21.28, -10.64], "speed": 0.0, "optaId": "97362"}], "ball": {"xyz": [-0.32, 0.1, 0.28], "speed": 11.73}, "live": false, "lastTouch": "home"}
