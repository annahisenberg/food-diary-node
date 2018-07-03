'use strict'

const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwtAuth = passport.authenticate('jwt', { session: false, failureRedirect: '/api/login-page' });
const path = require('path');

// @Description: these are the main html pages
router.get('/home', (req, res) => {
    res.sendFile(path.resolve('./public/' + 'index.html'));
});

router.get('/make-post/', jwtAuth, (req, res) => {
    res.sendFile(path.resolve('./public/' + 'post.html'));
});

router.get('/login-page', (req, res) => {
    res.sendFile(path.resolve('./public/' + 'login.html'));
});


router.get('/entries-list', jwtAuth, (req, res) => {
    res.sendFile(path.resolve('./public/' + 'entries.html'));
});

module.exports = { router };