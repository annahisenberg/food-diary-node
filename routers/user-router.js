'use strict'

const express = require('express');
const User = require('../models/user-model');
const router = express.Router();
const { verifyToken } = require('../server');
const passport = require('passport');

// This creates the token that the user needs to access protected routes. Use this for /login route
const createAuthToken = function(user) {
    return jwt.sign({ user }, config.JWT_SECRET, {
        subject: user.username,
        expiresIn: config.JWT_EXPIRY,
        algorithm: 'HS256'
    });
};


router.route('/users/:id')
    //updates user with specific id
    .put((req, res) => {
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
    })

//deletes user with specific id 
.delete((req, res) => {
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
router.route('/users')
    //gets all users
    .get((req, res) => {
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
    })

//Creates a new user
.post((req, res) => {
    const requiredFields = ['email', 'password'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }


    const explicityTrimmedFields = ['email', 'password'];
    const nonTrimmedField = explicityTrimmedFields.find(
        field => req.body[field].trim() !== req.body[field]
    );

    if (nonTrimmedField) {
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: 'Cannot start or end with whitespace',
            location: nonTrimmedField
        });
    }

    return User.find({ email })
        .count()
        .then(count => {
            if (count > 0) {
                //there is an existing user with the same username
                return Promise.reject({
                    code: 422,
                    reason: 'ValidationError',
                    message: 'Username already taken',
                    location: 'email'
                });
            }
            // If there is no existing user, hash the password
            return User.hashPassword(password);
        })
        .then(hash => {
            return User.create({
                username,
                password: hash,
                firstName,
                lastName
            });
        })
        .then(user => {
            return res.status(201).json(user);
        })
        .catch(err => {
            // Forward validation errors on to the client, otherwise give a 500
            // error because something unexpected has happened
            if (err.reason === 'ValidationError') {
                return res.status(err.code).json(err);
            }
            res.status(500).json({ code: 500, message: 'Internal server error' });
        });
});


const localAuth = passport.authenticate('local', { session: false });

router.post('/login', localAuth, (req, res) => {
    const authToken = createAuthToken(req.user.serialize());
    res.json({ authToken });
});

module.exports = { router };