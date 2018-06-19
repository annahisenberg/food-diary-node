'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const expect = chai.expect;

const DiaryPost = require('./models/models-diary-post');
const User = require('./models/models-sign-up');
const { app } = require('../server');
const { DATABASE_URL } = require('../config');

chai.use(chaiHttp);

describe('API functionality', function() {

    describe('GET index.html endpoint', function() {
        it('should return 200 status and go to homepage', function() {
            return chai.request(app)
                .get('/')
                .then(function(_res) {
                    expect(_res).to.have.status(200);
                });
        });
    });

    describe('GET post.html endpoint', function() {
        it('should return 200 status and go to posts page', function() {
            return chai.request(app)
                .get('/post')
                .then(function(_res) {
                    expect(_res).to.have.status(200);
                });
        });
    });

    describe('GET entries.html endpoint', function() {
        it('should return 200 status and go to list of entries page', function() {
            return chai.request(app)
                .get('/entries')
                .then(function(_res) {
                    expect(_res).to.have.status(200);
                });
        });
    });

    describe('GET login.html endpoint', function() {
        it('should return 200 status and go to login page', function() {
            return chai.request(app)
                .get('/login')
                .then(function(_res) {
                    expect(_res).to.have.status(200);
                });
        });
    });

});