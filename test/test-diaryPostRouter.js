'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const expect = chai.expect;
const should = require('chai').should();
const faker = require('faker');

const DiaryPost = require('../models/diarypost-model');
const { app, runServer, closeServer, verifyToken } = require('../server');
const { TEST_DATABASE_URL } = require('../config');

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

    describe('GET all entries endpoint', function() {
        it('should return all existing diary posts', function() {
            let res;
            return chai.request(app)
                .get('/entries')
                .then(function(_res) {
                    res = _res;
                    res.should.have.status(200);
                    expect(res.body.posts).to.have.lengthOf.at.least(1);
                    return DiaryPost.count();
                })
                .then(function(count) {
                    expect(res.body.posts).to.have.lengthOf(count);
                });
        });
    });

    describe('diarypost POST request', function() {
        it('should add a post', function() {
            const newPost = generateDiaryPostData();
            return chai.request(app)
                .post('/post')
                .set('Authorization', `Bearer ${token}`)
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
                breakfast: faker.lorem.word(),
                lunch: faker.lorem.word(),
                dinner: faker.lorem.word(),
                snacks: faker.lorem.words(),
                calories: faker.random.number(),
                img: faker.image.food()
            }

            const token = jwt.sign({});
            return DiaryPost
                .findOne()
                .then(entry => {
                    updateData._id = entry._id;
                    return chai.request(app)
                        .put(`/entries/${entry._id}`)
                        .set('Authorization', `Bearer ${token}`)
                        .send(updateData);
                })
                .then(function(res) {
                    expect(res).to.have.status(204);

                    return DiaryPost.findById(updateData._id);
                })
                .then(post => {
                    post.breakfast.should.deep.equal(updateData.breakfast);
                    post.lunch.should.deep.equal(updateData.lunch);
                    post.dinner.should.deep.equal(updateData.dinner);
                    post.snacks.should.deep.equal(updateData.snacks);
                    post.calories.should.deep.equal(updateData.calories);
                    post.img.should.deep.equal(updateData.img);
                })
        });
    });

    describe('diarypost DELETE endpoint', function() {
        it('should delete a diary post by id', function() {
            let deletedPost;
            const token = jwt.sign({});
            return DiaryPost
                .findOne()
                .then(_post => {
                    deletedPost = _post;
                    return chai.request(app)
                        .delete(`/entries/${deletedPost._id}`)
                        .set('Authorization', `Bearer ${token}`)
                })
                .then(res => {
                    res.should.have.status(204);
                    return DiaryPost.findById(deletedPost._id);
                })
                .then(post => {
                    should.not.exist(post);
                });
        });
    });
});