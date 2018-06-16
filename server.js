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


//Middleware
app.use(morgan('common'));
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoose
    .connect(DATABASE_URL)
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => console.log(err));

// @Route Home route
// @Description: this is the main html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/html/index.html'));
});

app.get('/post', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/html/post.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/html/login.html'));
});

//Gets all diary entries
// app.get('/entries', (req, res) => {
//     res.sendFile(path.join(__dirname + '/public/html/entries.html'));
// });

app.get('/entries', (req, res) => {
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
app.get('/entries/:id', (req, res) => {
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

app.post('/login', (req, res) => {
    const body = req.body;
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
            res.status(200).json({
                user,
            })
        })
        .catch(err => {
            res.status(500).json({
                message: "Something went wrong",
                err
            })
        })



});

app.post('/post', (req, res) => {
    // return res.status(200).json({
    //     response: req.body
    // });
    const payload = {
        breakfast: req.body.breakfast_input,
        lunch: req.body.lunch_input,
        dinner: req.body.dinner_input,
        snacks: req.body.snacks_input,
        // timestamps: req.body.date_input,
        calories: req.body.calories_input,
        img: req.body.pic
    };

    console.log(payload);

    // const diarypost = new DiaryPost({
    //     breakfast: req.body.breakfast_input,
    //     lunch: req.body.lunch_input,
    //     dinner: req.body.dinner_input,
    //     snacks: req.body.snacks_input,
    //     // timestamps: req.body.date_input,
    //     calories: req.body.calories_input,
    //     img: req.body.pic
    // });

    DiaryPost.create(payload)
        .then((post) => res.status(201).json(post))
        .catch((err) => {
            console.error(err);
            return res.status(500).json({
                error: 'Something went wrong'
            });
        });
});

// PUT routes
app.put('/entries/:id', (req, res) => {
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
app.delete('/entries/:id', (req, res) => {
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