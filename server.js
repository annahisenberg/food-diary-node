'use strict';

const express = require('express');
const app = express();

app.use(express.static('public'));


app.get('/', (req, res) => {
    res.status(200).end();
});


app.listen(process.env.PORT || 8080);

module.exports = {
    app
};