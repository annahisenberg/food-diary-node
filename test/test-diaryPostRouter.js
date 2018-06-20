'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const expect = chai.expect;
const should = require('chai').should();
const faker = require('faker');

const DiaryPost = require('./models/models-diary-post');
const { app, runServer, closeServer, verifyToken } = require('../server');
const { TEST_DATABASE_URL } = require('../config');

chai.use(chaiHttp);

// used to put randomish documents in db
// so we have data to work with and assert about.
function seedDiaryPostData() {
    console.info('seeding diary post data');
    const seedData = [];

    for (let i = 1; i <= 10; i++) {
        seedData.push(generateDiaryPostData());
    }
    //this will return a promise
    return DiaryPost.insertMany(seedData);

}

function generateDiaryPostData() {
    return {
        breakfast: faker.lorem.word(),
        lunch: faker.lorem.word(),
        dinner: faker.lorem.word(),
        snacks: faker.lorem.words(),
        calories: faker.random.number(),
        img: faker.image.food()
    }
}

function tearDownDb() {
    console.warn('Deleting database');
    return mongoose.connection.dropDatabase();
}

describe('DiaryPost API', function() {

    before(function() {
        return runServer(TEST_DATABASE_URL);
    });

    beforeEach(function() {
        return seedDiaryPostData();
    });

    afterEach(function() {
        return tearDownDb();
    });

    after(function() {
        return closeServer();
    });

    describe('Static pages', function() {

        describe('/home', function() {
            it('should return 200 status and HTML', function() {
                return chai.request(app)
                    .get('/index.html')
                    .then(function(res) {
                        res.should.have.status(200);
                        res.should.be.html;
                    });
            });
        });

        describe('/make-post', function() {
            it('should return 200 status and HTML', function() {
                return chai.request(app)
                    .get('/post.html')
                    .then(function(res) {
                        expect(res).to.have.status(200);
                        expect(res).to.be.html;
                    });
            })
        });

        describe('/login-page', function() {
            it('should return 200 status and HTML', function() {
                return chai.request(app)
                    .get('/login.html')
                    .then(function(res) {
                        res.should.have.status(200);
                        res.should.be.html;
                    });
            });
        });

        describe('/entries-list', function() {
            it('should return 200 status and HTML', function() {
                return chai.request(app)
                    .get('/entries.html')
                    .then(function(res) {
                        res.should.have.status(200);
                        res.should.be.html;
                    });
            });
        })
    });
});