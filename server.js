'use strict';

const express = require('express');
const app = express();
const path = require("path");
const {
    DATABASE_URL,
    PORT
} = require('./config');
const {
    DiaryPost
} = require('./models/models-diary-post');
const {
    Register
} = require('./models/models-sign-up');

//Middleware
app.use(morgan('common'));
app.use(express.static('public'));
app.use(express.json());


//GET Routes
app.get('/post', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/html/post.html'));
});

//Gets all diary entries
app.get('/entries', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/html/entries.html'));

    DiaryPost
        .find()
        .then(posts => {
            res.json(posts);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: 'something went wrong'
            });
        });
});

//gets diary entry by id 
app.get('/entries/:id', (req, res) => {
    DiaryPost
        .findById(req.params.id)
        .then(post => res.json(post))
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: 'something went wrong'
            });
        });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/html/index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/html/login.html'));
});


// POST routes
app.post('/login', (req, res) => {
    const requiredFields = ['username', 'password', 'email'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }

    Register
        .create({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email
        })
        .then(user => res.status(201).json(user))
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: 'Something went wrong'
            });
        });
});

app.post('/post', (req, res) => {
    DiaryPost
        .create({
            breakfast: req.body.breakfast_input,
            lunch: req.body.lunch_input,
            dinner: req.body.dinner_input,
            snacks: req.body.snacks_input,
            timestamps: req.body.date_input,
            calories: req.body.calories_input,
            img: req.body.pic
        })
        .then(post => res.status(201).json(post))
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: 'Something went wrong'
            });
        });
});

// PUT routes
app.put('/entries/:id', (req, res) => {

});

// DElETE routes
app.delete('/entries/:id', (req, res) => {

});



if (require.main === module) {
    app.listen(process.env.PORT || 8080, function () {
        console.info(`App listening on ${this.address().port}`);
    });
}



module.exports = app;