/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

const request = require('supertest');
const chai = require('chai');
const app = require('../app');
const { articleId } = require('./article');

const should = chai.should();
const { expect } = chai;

describe('GET /api/v1/feed', () => {
  it('Should get all articles and gifs and display on the frontend', () => {
    request(app).get('/api/v1/feed')
      .expect(200)
      .then((res) => {
        res.body.status.should.equal('success');
        res.body.data.should.not.be.empty;
      })
      .catch((err) => {
        expect(400);
        expect((res) => {
          res.body.status.should.equal('failure');
          res.body.error.should.equal(err);
        });
      });
  });
  it('Should flag an article/gif', () => {
    request(app).post(`/api/v1/feed/${articleId}/isFlagged`)
      .send({
        isFlagged: false,
      })
      .expect(201)
      .then((res) => {
        res.body.status.should.equal('success');
        res.body.data.should.not.be.empty;
      })
      .catch((err) => {
        expect((res) => {
          res.status.should.be(400);
          res.body.status.should.equal('failure');
          res.body.error.should.equal(err);
        });
      });
  });
});
