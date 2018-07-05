'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const expect = chai.expect;
const should = require('chai').should();
const faker = require('faker');
const jwt = require('jsonwebtoken');

const DiaryPost = require('../models/diarypost-model');
const { app, runServer, closeServer, } = require('../server');
const { TEST_DATABASE_URL, JWT_SECRET } = require('../config');

console.log("runServer:", runServer);


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
        notes: faker.lorem.words(),
        img: faker.image.food()
    }
}

function tearDownDb() {
    console.warn('Deleting database');
    return mongoose.connection.dropDatabase();
}

function generateUserData() {
    return {
        email: faker.internet.email(),
        password: faker.internet.password()
    }
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

    //works
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

    //works
    describe('GET all entries endpoint', function() {
        it('should return all existing diary posts', function() {
            let user = generateUserData();
            var token = jwt.sign({ user }, JWT_SECRET);

            let res;
            return chai.request(app)
                .get('/api/posts')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .set('Cookie', `Token=${token}`)
                .then(function(_res) {
                    res = _res;
                    res.should.have.status(200);
                    expect(res.body).to.have.lengthOf.at.least(1);
                    return DiaryPost.count();
                })
                .then(function(count) {
                    expect(res.body).to.have.lengthOf(count);
                });
        });
    });

    describe('diarypost POST request', function() {
        it('should make a diary post', function() {
            const newPost = generateDiaryPostData();
            let user = generateUserData();
            var token = jwt.sign({ user }, JWT_SECRET);

            return chai.request(app)
                .post('/api/posts')
                .set('Cookie', `Token=${token}`)
                .send(newPost)
                .then(function(res) {
                    expect(res).to.have.status(201);
                    expect(res).to.be.json;
                    expect(res.body.breakfast).to.deep.equal(newPost.breakfast);
                    expect(res.body.lunch).to.deep.equal(newPost.lunch);
                    expect(res.body.dinner).to.deep.equal(newPost.dinner);
                    expect(res.body.snacks).to.deep.equal(newPost.snacks);
                    expect(res.body.calories).to.deep.equal(newPost.calories);
                    expect(res.body.img).to.deep.equal(newPost.img);
                });
        });
    });

    describe('diarypost PUT request', function() {
        it('should update fields sent', function() {
            const updateData = {
                title: faker.lorem.words(),
                breakfast: faker.lorem.word(),
                lunch: faker.lorem.word(),
                dinner: faker.lorem.word(),
                snacks: faker.lorem.words(),
                notes: faker.lorem.words(),
                img: faker.image.food()
            }

            let user = generateUserData();
            var token = jwt.sign({ user }, JWT_SECRET);

            return DiaryPost
                .findOne()
                .then(entry => {
                    updateData.id = entry.id;
                    return chai.request(app)
                        .put(`/api/posts/${entry.id}`)
                        .set('Content-Type', 'application/json')
                        .set('Accept', 'application/json')
                        .set('Cookie', `Token=${token}`)
                        .send(updateData);
                })
                .then(function(res) {
                    expect(res).to.have.status(200);

                    return DiaryPost.findById(updateData.id);
                })
                .then(post => {
                    post.title.should.deep.equal(updateData.title);
                    post.breakfast.should.deep.equal(updateData.breakfast);
                    post.lunch.should.deep.equal(updateData.lunch);
                    post.dinner.should.deep.equal(updateData.dinner);
                    post.snacks.should.deep.equal(updateData.snacks);
                    post.notes.should.deep.equal(updateData.notes);
                    post.img.should.deep.equal(updateData.img);
                })
        });
    });

    //works
    describe('diarypost DELETE endpoint', function() {
        it('should delete a diary post by id', function() {
            let deletedPost;
            let user = generateUserData();
            var token = jwt.sign({ user }, JWT_SECRET);

            return DiaryPost
                .findOne()
                .then(_post => {
                    deletedPost = _post;
                    return chai.request(app)
                        .delete(`/api/posts/${deletedPost._id}`)
                        .set('Cookie', `Token=${token}`)
                })
                .then(res => {
                    res.should.have.status(200);
                    return DiaryPost.findById(deletedPost._id);
                })
                .then(post => {
                    should.not.exist(post);
                });
        });
    });
});