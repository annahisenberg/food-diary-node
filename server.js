'use strict';

const express = require('express');
const app = express();
const path = require('path');
const morgan = require('morgan');
const mongoose = require('mongoose');
const { DATABASE_URL, PORT } = require('./config');
const DiaryPost = require('./models/models-diary-post');
const User = require('./models/models-sign-up');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


//Middleware
app.use(morgan('common'));
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Verify Token
function verifyToken(req, res, next) {
    // Get auth header value
    const bearerHeader = req.headers['authorization'];
    //Check if bearer is undefined
    if (typeof bearerHeader !== 'undefined') {
        // Split at sthepace
        const bearer = bearerHeader.split(' ');
        //Get token from array
        const bearerToken = bearer[1];
        //Set the token
        req.token = bearerToken;
        //Next middleware
        next();
    } else {
        // forbidden
        res.sendStatus(403);
    }
}

mongoose
    .connect(DATABASE_URL)
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => console.log(err));

// @Route Home route
// @Description: this is the main html
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/html/index.html'));
});

app.get('/make-post', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/html/post.html'));
});

app.get('/login-page', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/html/login.html'));
});

//Gets all diary entries
app.get('/entries-list', verifyToken, (req, res) => {
    res.sendFile(path.join(__dirname + '/public/html/entries.html'));
});

app.get('/entries', verifyToken, (req, res) => {
    DiaryPost.find()
        .then((posts) => {
            res.json(posts);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({
                error: 'something went wrong'
            });
        });
});

//gets diary entry by id
app.get('/entries/:id', verifyToken, (req, res) => {
    DiaryPost.findById(req.params.id)
        .then((post) => res.json(post))
        .catch((err) => {
            console.error(err);
            res.status(500).json({
                error: 'something went wrong'
            });
        });
});

// POST routes
app.post('/register', (req, res) => {
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

app.post('/login', (req, res) => {

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
        })



});

app.post('/post', verifyToken, (req, res) => {

    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            // res.json({
            //     message: 'Post created',
            //     authData
            // })
            const payload = {
                breakfast: req.body.breakfast_input,
                lunch: req.body.lunch_input,
                dinner: req.body.dinner_input,
                snacks: req.body.snacks_input,
                // timestamps: req.body.date_input,
                calories: req.body.calories_input,
                img: req.body.pic
            };
            DiaryPost.create(payload)
                .then((post) => res.status(201).json(post))
                .catch((err) => {
                    console.error(err);
                    return res.status(500).json({
                        error: 'Something went wrong'
                    });
                });
        }
    });

});

// PUT routes
app.put('/entries/:id', verifyToken, (req, res) => {
    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        return res.status(400).json({
            error: 'Request path id and request body id values must match'
        });
    }

    const updated = {};
    const updateableFields = [
        'breakfast',
        'lunch',
        'dinner',
        'snacks',
        'timestamps',
        'calories',
        'img'
    ];
    updateableFields.forEach((field) => {
        if (field in req.body) {
            updated[field] = req.body[field];
        }
    });

    DiaryPost.findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
        .then((updatedPost) =>
            res.status(200).json({
                message: 'You successfully updated your post.'
            })
        )
        .catch((err) => {
            res.status(500).json({
                message: 'There is an error with updating your post.'
            });
        });
});

// DElETE routes
app.delete('/entries/:id', verifyToken, (req, res) => {
    DiaryPost.findByIdAndRemove(req.params.id).then(() => {
        console.log(`Deleted diary entry with id \`${req.params.id}\``);
        return res.status(200).json({
            message: 'Your entry was successfully deleted',
            post: req.params.id
        });
    });
});

//If user goes to unknown route, then this error message will show
app.use('*', function(req, res) {
    res.status(404).json({
        message: 'Not Found'
    });
});

if (require.main === module) {
    app.listen(process.env.PORT || 8080, function() {
        console.info(`App listening on ${this.address().port}`);
    });
}

module.exports = app;