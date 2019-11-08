/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

const request = require('supertest');
const chai = require('chai');
const { loggedInToken, loggedInUserId } = require('./user');
const app = require('../app');
const { articleId } = require('./article');

const should = chai.should();
const { expect } = chai;

describe('Create, delete, modify and flag comments', () => {
  it('Should be able to Create comment under a specific article/gif', () => {
    request(app).post(`/api/v1/feed/${articleId}/comments`)
      .set('Content-Type', 'application/json')
      .set('Authorization', loggedInToken)
      .send({

      })
      .expect(201)
      .then((res) => {
        res.body.status.should.equal('success');
        res.body.data.message.should.equal('Comment successfully posted');
        res.body.data.contentId.should.exist;
        res.body.data.commentId.should.exist;
        res.body.data.comments.should.exist;
        res.body.data.comments.should.be.Array.Prototype;
        res.body.data.createdOn.should.exist;
      })
      .catch((err) => {
        expect(400);
        expect((res) => {
          res.body.status.should.equal('failure');
          res.body.error.should.equal(err);
        });
      });
  });
});
