'use strict';

const express = require('express');
const app = express();
const path = require("path");

app.use(express.static('public'));


app.get('/post', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/post.html'));
});

app.get('/entries', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/entries.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});



if (require.main === module) {
    app.listen(process.env.PORT || 8080, function () {
        console.info(`App listening on ${this.address().port}`);
    });
}

module.exports = {
    app
};