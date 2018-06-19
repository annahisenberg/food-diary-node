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
const { router: userRouter } = require('./routers/user-router');
const { router: diaryPostRouter } = require('./routers/diarypost-router');


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
        // Split at the space
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

// Routes
app.use('/api', userRouter);
app.use('/api', diaryPostRouter);

//If user goes to unknown route, then this error message will show
app.use('*', function(req, res) {
    res.status(404).json({
        message: 'Not Found'
    });
});

//Connect to database
mongoose
    .connect(DATABASE_URL)
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => console.log(err));

// @Route Home route
// @Description: this is the main html
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/html/index.html'));
});

app.get('/make-post', verifyToken, (req, res) => {
    res.sendFile(path.join(__dirname + '/public/html/post.html'));
});

app.get('/login-page', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/html/login.html'));
});

app.get('/entries-list', verifyToken, (req, res) => {
    res.sendFile(path.join(__dirname + '/public/html/entries.html'));
});



if (require.main === module) {
    app.listen(process.env.PORT || 8080, function() {
        console.info(`App listening on ${this.address().port}`);
    });
}

module.exports = { app, verifyToken };