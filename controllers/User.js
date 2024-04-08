const User = require("../models/User");
const jwt = require('jsonwebtoken')
const bcrypt = require("bcryptjs")
const generateTokens = require("../utils/generateTokens");
const { 
    registerValidation,
    loginValidation,
    refreshTokenValidation,
} = require("../utils/validation");
const verifyRefreshToken = require("../utils/verifyRefreshToken");
const authConfig = require("../config/auth");

const register = async (req, res) => {
    console.log(req.body);
    
    const { error } = registerValidation(req.body);
    if (error) {
      console.log(error)
        return res.apiError(error.details[0].message);
    }        

    const uForEmail = await User.findOne({
        email : req.body.email.toLowerCase()
    });
    if (uForEmail)
        return res.apiError("This Email is already registered!");

    const uForName = await User.findOne({
        username : req.body.username
    })
    if (uForName)
        return res.apiError("This username is already registered!");

    const salt = await bcrypt.genSalt(authConfig.salt);
    const hashPasswod = await bcrypt.hash(req.body.password, salt);
    const user = await User({ ...req.body, password: hashPasswod }).save();

    return res.apiSuccess({
        id: user._id,
        username : user.username,
        email : user.email,
    });
};

const login =  async (req, res) => {
    try {
        const { error } = loginValidation(req.body);
        if (error)
            return res.apiError(error.details[0].message);

        const user = await User.findOne({ username: req.body.username });
        if (!user) 
            return res.apiError("Unexisting username");

        const verifiedPassword = await bcrypt.compare(
            req.body.password,
            user.password
        );

        if (!verifiedPassword)
            return res.apiError("Invalid Password");

        const { accessToken, refreshToken } = await generateTokens({
            id: user._id,
            name: user.username,
        });

        return res.apiSuccess({
            id: user._id,
            username : user.username,
            token: {
                accessToken,
                refreshToken,
                expiryTime: authConfig.jwtExpiration
            },
        })
    } catch (err) {
        console.log(err);
        return res.apiError("Internal Server Error");
    }
};

const refresh = async (req, res) => {
    try {
        const { error } = refreshTokenValidation(req.body);
        if (error)
            return res.apiError(error.details[0].message);

        verifyRefreshToken(req.body.refreshToken)
            .then(({ tokenDetails }) => {
                generateTokens({
                    id: tokenDetails.id,
                    name: tokenDetails.name,
                })
                .then(({ accessToken, refreshToken }) => {
                    return res.apiSuccess({
                        id: tokenDetails._id,
                        username : tokenDetails.name,
                        token: {
                            accessToken,
                            refreshToken,
                            expiryTime: authConfig.jwtExpiration
                        },
                    })
                })
                .catch((err) => {
                    console.log(err);
                    res.apiError(err.message);
                });;
            })
            .catch((err) => {
                console.log(err);
                res.apiError(err.message);
            });
    } catch (err) {
        console.log(err);
        return res.apiError("Internal Server Error");
    }
};

 
 module.exports = {
   register,
   login,
   refresh
 };