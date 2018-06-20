'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const expect = chai.expect;
const faker = require('faker');

const User = require('./models/models-sign-up');
const { app, runServer, closeServer, verifyToken } = require('../server');
const { DATABASE_URL } = require('../config');

chai.use(chaiHttp);