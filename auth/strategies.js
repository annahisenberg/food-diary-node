'use strict';

const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user-model');
const { JWT_SECRET } = require('../config');



const localStrategy = new LocalStrategy((email, password, done) => {
    let user;

    User.findOne({ email })
        .then(_user => {
            user = _user;
            if (!user) {
                // Return a rejected promise so we break out of the chain of .thens.
                // Any errors like this will be handled in the catch block.
                return Promise.reject({
                    reason: 'LoginError',
                    message: 'Incorrect username or password'
                });
            }
            return user.validatePassword(password);
        })
        .then(isValid => {
            if (!isValid) {
                return Promise.reject({
                    reason: 'LoginError',
                    message: 'Incorrect username or password'
                });
            }
            return done(null, user);
        })
        .catch(err => {
            if (err.reason === 'LoginError') {
                return done(null, false, err);
            }
            return done(err, false);
        });
});

let opts = {}
opts.secretOrKey = JWT_SECRET;
opts.algorithms = ['HS256'];
opts.jwtFromRequest = function(req) {
    //Get the cookie from the browser with the name "Token"
    const token = req.cookies.Token;
    return token
};

const jwtStrategy = new JwtStrategy(opts, (payload, done) => {
    // The serialized user email
    done(null, payload.user);
});

module.exports = { localStrategy, jwtStrategy };