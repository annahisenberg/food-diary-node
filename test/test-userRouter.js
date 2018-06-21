'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const expect = chai.expect;
const should = require('chai').should();
const faker = require('faker');

const User = require('../models/user-model');
const { app, runServer, closeServer, verifyToken } = require('../server');
const { TEST_DATABASE_URL } = require('../config');


chai.use(chaiHttp);

// used to put randomish documents in db
// so we have data to work with and assert about.
function seedFakeUserDb() {
    console.info('seeding fake user db');
    const seedData = [];

    for (let i = 1; i <= 10; i++) {
        seedData.push(generateUserData());
    }
    //this will return a promise
    return User.insertMany(seedData);

}

function generateUserData() {
    return {
        email: faker.internet.email(),
        password: faker.internet.password()
    }
}

function tearDownDb() {
    console.warn('Deleting database');
    return mongoose.connection.dropDatabase();
}

before(function() {
    return runServer(TEST_DATABASE_URL);
});

beforeEach(function() {
    return seedFakeUserDb();
});

afterEach(function() {
    return tearDownDb();
});

after(function() {
    return closeServer();
});

describe('User api routes', function() {
    describe('POST request for /register', function() {
        it('should create a new user in the database', function() {
            let newUser = generateUserData();
            return chai.request(app)
                .post('/register')
                .send(newUser)
                .then(function(res) {
                    res.should.have.status(201);
                    res.should.be.json;
                });
        });
    });

    describe('Login API', function() {
        it('should login user', function() {
            return chai.request(app)
                .post('/login')
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .send({ email: 'email', password: 'password' })
                .then(res => {
                    res.should.have.status(200)
                    res.should.be.json;
                });
        });
    });
});