'use strict'

const express = require('express');
const User = require('../models/user-model');
const router = express.Router();
const passport = require('passport');

// This creates the token that the user needs to access protected routes. Use this for /login route
const createAuthToken = function(user) {
    return jwt.sign({ user }, config.JWT_SECRET, {
        subject: user.username,
        expiresIn: config.JWT_EXPIRY,
        algorithm: 'HS256'
    });
};


router.put('/users/:id', (req, res) => {
    //Make sure there is an id in req.params & req.body and make sure they match
    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        return res.status(400).json({
            error: 'Request path id and request body id values must match'
        });
    }

    const updated = {};
    const updateableFields = [
        'email',
        'password'
    ];
    updateableFields.forEach((field) => {
        if (field in req.body) {
            updated[field] = req.body[field];
        }
    });

    User
        .findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
        .then((updatedUser) => {
            res.status(200).json({
                message: 'You successfully updated your user info.'
            });
        })
        .catch((err) => {
            res.status(500).json({
                message: 'There is an error with updating your user info.'
            });
        });
});

router.delete('/users/:id', (req, res) => {
    User
        .findByIdAndRemove(req.params.id).then(() => {
            console.log(`Deleted user with id \`${req.params.id}\``);
            return res.status(200).json({
                message: 'Your user was successfully deleted',
                post: req.params.id
            });
        });
});



// POST routes
router.get('/users', (req, res) => {
    User
        .find()
        .then((users) => {
            res.json(users);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({
                error: 'something went wrong'
            });
        });
});

router.post('/users', (req, res) => {
    const email = req.body.email;
    const pass = req.body.password;

    User
        .findOne({ email })
        .then(_user => {
            if (_user) {
                //there is an existing user with the same username
                return Promise.reject({
                    code: 422,
                    reason: 'ValidationError',
                    message: 'Username already taken',
                    location: 'email'
                });
            }
            // If there is no existing user, hash the password
            return User.hashPassword(pass);
        })
        .then(hash => {
            return User.create({
                email,
                password: hash
            });
        })
        .then(newUser => {
            return res.status(201).json(newUser);
        })
        .catch(err => {
            // Forward validation errors on to the client, otherwise give a 500
            // error because something unexpected has happened
            if (err.reason === 'ValidationError') {
                return res.status(err.code).json(err);
            }
            res.status(500).json({ code: 500, message: 'Internal server error' });
        });
})




const localAuth = passport.authenticate('local', { session: false });

router.post('/login', localAuth, (req, res) => {
    const authToken = createAuthToken(req.user.serialize());
    res.json({ authToken });
});

module.exports = { router };