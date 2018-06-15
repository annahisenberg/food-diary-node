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
app.use(express.static('public'));
app.use(express.json());


//Routes
app.get('/post', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/html/post.html'));
});

app.get('/entries', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/html/entries.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/html/index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/html/login.html'));
});



if (require.main === module) {
    app.listen(process.env.PORT || 8080, function () {
        console.info(`App listening on ${this.address().port}`);
    });
}



module.exports = {
    app
};