import Joi from 'joi';

export default () => {
    id: Joi.string().regex(/^[0-9a-fA-F]{24}$}/);
};
