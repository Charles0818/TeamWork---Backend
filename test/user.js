/* eslint-disable no-console */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const request = require('supertest');
const { expect } = require('chai');
const app = require('../app');

let loggedInToken = '';
let loggedInUserId;

describe('POST /api/v1/auth/signin', () => {
  it('should return 200 status code, success message and token', () => {
    request(app).post('/api/v1/auth/signin')
      .send({
        email: 'admin@gmail.com',
        password: '@admin',
      })
      .expect(200)
      .expect((res) => {
        res.body.status.should.be.equal('success');
        res.body.data.token.should.not.be.empty;
        loggedInToken = res.body.data.token;
        loggedInUserId = res.body.data.userId;
      });
  });
  it('should throw an error when email does not exist in the database', () => {
    request(app).post('/api/v1/auth/signin')
      .send({
        email: 'invalid@gmail.com',
        password: '@admin',
      })
      .expect(401)
      .expect((res) => {
        res.body.error.should.be.equal('User not found');
      });
  });
  it('should throw an error when password does not match', () => {
    request(app).post('/api/v1/auth/signin')
      .send({
        email: 'admin@gmail.com',
        password: '@incorrect',
      })
      .expect(401)
      .expect((res) => {
        res.body.error.should.be.equal('Incorrect Password');
      });
  });
});

describe('POST /api/v1/auth/create-user', () => {
  it('should create a user account', () => {
    request(app).post('/api/v1/auth/create-user')
      .set('Authorization', loggedInToken)
      .send({
        firstName: 'charlieboy',
        lastName: 'Omoregie',
        email: 'charlieboy@gmail.com',
        password: 'charlie',
        gender: 'male',
        jobRole: 'Frontend developer',
        department: 'Engineering',
        address: '46, Osayande',
      })
      .expect(201)
      .expect((res) => {
        res.body.status.should.equal('Success');
        res.body.data.message.should.not.be.empty;
        res.body.data.token.should.not.be.empty;
        res.body.data.userId.should.not.be.empty;
      });
  });
  it('should throw an error if the email already exists in the database', () => {
    request(app).post('/api/v1/auth/create-user')
      .set('Authorization', loggedInToken)
      .send({
        email: 'admin@gmail.com',
        password: 'charlie',
      })
      .expect(400)
      .expect((res) => {
        res.body.error.should.be.equal('An exact email already exist in the database');
      });
  });
});

module.exports = { loggedInToken, loggedInUserId };
