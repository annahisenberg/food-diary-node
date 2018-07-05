'use strict';

const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const { DATABASE_URL, PORT } = require('./config');
const DiaryPost = require('./models/diarypost-model');
const User = require('./models/user-model');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { router: userRouter } = require('./routers/user-router');
const { router: mainPagesRouter } = require('./routers/main-pages-router');
const { router: diaryPostRouter } = require('./routers/diarypost-router');
const { localStrategy, jwtStrategy } = require('./auth/strategies');
const cookieParser = require('cookie-parser');



//Middleware
app.use(morgan('common'));
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


passport.use(localStrategy);
passport.use(jwtStrategy);

// Routes
app.use('/api', userRouter);
app.use('/api', diaryPostRouter);
app.use('/api', mainPagesRouter);


//If user goes to unknown route, then this error message will show
app.use('*', function(req, res) {
    res.status(404).json({
        message: 'Not Found'
    });
});



// closeServer needs access to a server object, but that only
// gets created when `runServer` runs, so we declare `server` here
// and then assign a value to it in run
let server;

// this function connects to our database, then starts the server
function runServer(databaseUrl, port = PORT) {
    return new Promise((resolve, reject) => {
        mongoose.connect(databaseUrl, err => {
            if (err) {
                return reject(err);
            }
            server = app.listen(port, () => {
                    console.log(`Your app is listening on port ${port}`);
                    resolve();
                })
                .on('error', err => {
                    mongoose.disconnect();
                    reject(err);
                });
        });
    });
}

// this function closes the server, and returns a promise. we'll
// use it in our integration tests later.
function closeServer() {
    return mongoose.disconnect().then(() => {
        return new Promise((resolve, reject) => {
            console.log('Closing server');
            server.close(err => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    });
}

if (require.main === module) {
    runServer(DATABASE_URL).catch(err => console.error(err));
}


module.exports = { app, runServer, closeServer };