'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

const {
    app
} = require('../server');

chai.use(chaiHttp);

describe('GET endpoint', function () {
    it('should return 200 status and go to homepage', function () {
        return chai.request(app)
            .get('/')
            .then(function (_res) {
                expect(_res).to.have.status(200);
            });
    });
});