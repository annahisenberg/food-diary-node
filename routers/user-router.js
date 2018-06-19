'use strict'

const express = require('express');
const User = require('../models/user-model');
const router = express.Router();
const { verifyToken } = require('../server');


// POST routes
router.post('/register', (req, res) => {
    const requiredFields = ['username', 'password', 'email'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (err, hash) => {
            if (err) {
                res.status(500).json({
                    error: 'Password incorrect'
                });
            }

            req.body.password = hash;

            const newUser = {
                username: req.body.username,
                password: req.body.password,
                email: req.body.email
            };

            User.create(newUser)
                .then((user) =>
                    res.status(201).json({
                        message: 'You have successfully created a new account.',
                        user
                    })
                )
                .catch((err) => {
                    console.error(err);
                    res.status(500).json({
                        error: 'Something went wrong'
                    });
                });

        });
    });
});


router.post('/login', (req, res) => {

    const email = req.body.email;

    User
        .findOne({ email })
        .then(user => {
            if (!user) {
                return res.status(404).json({
                    message: "User not found",
                    user,
                })
            }

            // compare user.password(comes from database) with req.body.password to see if they match
            bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
                if (!isMatch) {
                    res.status(400).json({
                        message: "Incorrect password.",
                        isMatch
                    });
                }

                user.password = ':)';

                return res.status(200).json({
                    message: 'You have successfully logged in',
                    isMatch,
                    user
                });
            });

            jwt.sign({ user }, 'secretkey', { expiresIn: '2 days' }, (err, token) => {
                res.json({
                    token
                });
            });



        })
        .catch(err => {
            res.status(500).json({
                message: "Something went wrong",
                err
            })
        });
});

module.exports = { router };