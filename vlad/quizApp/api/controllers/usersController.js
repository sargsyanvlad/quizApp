// let express = require('express');
// let router = express.Router();
// let bodyParser = require('body-parser');
// router.use(bodyParser.json());
const appRoot = require('app-root-path');
const config = require(`${appRoot}/config`);
const jwt = require('jsonwebtoken');
const userModel = require('../models/userSchema');
// const secret = process.env.JWT_SECRET;

class UserControllerClass {
    constructor() {
        this.signIn = this.signIn.bind(this);
        this.signUp = this.signUp.bind(this);
        this.models = { userModel }
    };

    async signUp(req, res)  {
        try {
            if (!req.body.username || !req.body.password || !req.body.role) {
                return res.json({success: false, msg: 'Please pass username, password and role.'});
            }

            const newUser = new this.models.userModel({ ...req.body });
            const user = await newUser.save();
            if (!user) {
                return res.status(258).send({success: false, msg: 'Username already exists.'});
            }
            return res.status(200).send({success: true, msg: 'Successful created new user.'});
        } catch (err) {
            console.log('err->', err);
            return res.status(409).send({ success: false, msg: 'Something went wrong' })
        }
    };

    async signIn(req, res) {
        try {
            const user = await this.models.userModel.findOne({
                username: req.body.username
            });

            if (!user) {
                return res.status(258).send({success: false, msg: 'User not found. '});
            }

            user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {
                    // if user is found and password is right create a token
                    let token = jwt.sign({username: user.username}, config.AUTHORIZATION_TOKEN_SECRET, {expiresIn: '1h'});
                    // return the information including token as JSON
                    return res.status(200).send({success: true, token: 'CUSTOM ' + token});
                }
                return res.status(258).send({success: false, msg: 'Authentication failed. Wrong password.'});
            });
        } catch (err) {
            return res.status(409).send({ success: false, msg: 'Something went wrong' })
        }
    };

}

module.exports = new UserControllerClass();
