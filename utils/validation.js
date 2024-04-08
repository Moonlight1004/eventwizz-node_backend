const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const registerValidation = (body) => {
    const schema = Joi.object({
        username: Joi.string().required().label("username"),
        email: Joi.string().email().required().label("email"),
        password: passwordComplexity().required().label("password"),
    });
    return schema.validate(body);
};

const loginValidation = (body) => {
    const schema = Joi.object({
        username: Joi.string().required().label("username"),
        password: Joi.string().required().label("Password"),
    });
    return schema.validate(body);
};

const refreshTokenValidation = (body) => {
    const schema = Joi.object({
        refreshToken: Joi.string().required().label("Refresh Token"),
    });
    return schema.validate(body);
};


module.exports = {
    registerValidation,
    loginValidation,
    refreshTokenValidation,  
};
