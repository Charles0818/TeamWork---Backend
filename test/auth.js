/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

const request = require('supertest');
const { expect } = require('chai');
const jwt = require('jsonwebtoken');
const app = require('../app');
require('dotenv').config();
const { loggedInUserId, loggedInToken } = require('./user');

describe('authentication requests', () => {
  it('Should be able to authenticate incoming requests', () => {
    request(app).post('/api/v1/auth/')
      .set('Authorization', loggedInToken)
      .send(loggedInUserId)
      .then(() => {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.SECRET);
        const { userId } = decodedToken;
        if (req.body.userId && req.body.userId !== userId) {
          throw new Error('Invalid user ID');
        } else {
          next();
        }
      })
      .catch((error) => {
        expect((res) => {
          expect.res.status.to.be(401);
          res.body.error.should.equal(`Unauthorized request, ${error} `);
        });
      });
  });
});
