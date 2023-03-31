import Joi from 'joi';
import mongoose from 'mongoose';

const StatsSchema = new mongoose.Schema(
    {
        ownGoals: { type: Number, required: true },
        goals: { type: Number, required: true },
        assists: { type: Number, required: true },
        penaltiesScored: { type: Number, required: true },
        penaltiesMissed: { type: Number, required: true },
        penaltiesSaved: { type: Number, required: true },
    },
    { _id: false }
);

const PlayerSchema = new mongoose.Schema(
    {
        number: { type: Number, required: true },
        position: { type: String, required: true },
        optaId: { type: String, required: true },
        ssiId: { type: String, required: true },
        statBombId: { type: Number, required: true },
        name: { type: String, required: true },
        birthDate: { type: Date, required: true },
        gender: { type: String, required: true },
        height: { type: Number, nullable: true },
        weight: { type: Number, nullable: true },
        country: { type: String, required: true },
        stats: StatsSchema,
    },
    { _id: false }
);

const statsValidationSchema = Joi.object({
    ownGoals: Joi.number().required(),
    goals: Joi.number().required(),
    assists: Joi.number().required(),
    penaltiesScored: Joi.number().required(),
    penaltiesMissed: Joi.number().required(),
    penaltiesSaved: Joi.number().required(),
});

const playerValidationSchema = Joi.object({
    number: Joi.number().required(),
    position: Joi.string().required(),
    optaId: Joi.string().required(),
    ssiId: Joi.string().required(),
    statBombId: Joi.number().required(),
    name: Joi.string().required(),
    birthDate: Joi.date().required(),
    gender: Joi.string().required(),
    height: Joi.number().allow(null).required(),
    weight: Joi.number().allow(null).required(),
    country: Joi.string().required(),
    stats: statsValidationSchema.required(),
});

const Player = mongoose.model('Player', PlayerSchema);

export { Player, PlayerSchema, playerValidationSchema };
