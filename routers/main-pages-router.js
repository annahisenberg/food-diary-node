'use strict'

const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwtAuth = passport.authenticate('jwt', { session: false });
const path = require('path');

// @Description: these are the main html pages
router.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});
// 
router.get('/make-post/:token', jwtAuth, (req, res) => {
    const numb = req.params.token;
    console.log('MY TOKEN ', numb);
    // res.sendFile(path.join(__dirname + '/public/post.html'));
    res.status(200).json({
        ok: true
    })
});

router.get('/login-page', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/login.html'));
});

router.get('/entries-list', jwtAuth, (req, res) => {
    res.sendFile(path.join(__dirname + '/public/entries.html'));
});

module.exports = { router };