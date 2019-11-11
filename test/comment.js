/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

const request = require('supertest');
const { expect } = require('chai');
const { loggedInToken, loggedInUserId } = require('./user');
const app = require('../app');
const { articleId } = require('./article');

let commentId = null;

describe('Create, delete, modify and flag comments', () => {
  it('Should be able to Create comment under a specific article/gif', () => {
    request(app).post(`/api/v1/feed/${articleId}/comments`)
      .set('Content-Type', 'application/json')
      .set('Authorization', loggedInToken)
      .send({
        comment: 'Science is evolving, so do i expect the mind to behave',
        userId: loggedInUserId,
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
        commentId = res.body.data.commentId;
      })
      .catch((err) => {
        expect(400);
        expect((res) => {
          res.body.status.should.equal('failure');
          res.body.error.should.equal(err);
        });
      });
  });
  it('Should be able to delete a specific comment belonging to an article/gif', () => {
    request(app).delete(`/api/v1/feed/${articleId}/comments/${commentId}`)
      .set('Authorization', loggedInToken)
      .expect(200)
      .then((res) => {
        res.body.status.should.equal('success');
        res.body.data.message.should.equal('Comment successfully deleted');
      })
      .catch((err) => {
        expect(400);
        expect((res) => {
          res.body.status.should.equal('failure');
          res.body.error.should.equal(`could not delete comment, ${err}`);
        });
      });
  });
  it('Should be able to modify a specific comment belonging to an article/gif', () => {
    request(app).patch(`/api/v1/feed/${articleId}/comments/${commentId}`)
      .set('Authorization', loggedInToken)
      .send({
        comment: '(Updated) Science is evolving, the mind should be ready to accept its changes',
        userId: loggedInUserId,
      })
      .expect(200)
      .then((res) => {
        res.body.status.should.equal('success');
        res.body.data.message.should.equal('Comment successfully updated');
      })
      .catch((err) => {
        expect(400);
        expect((res) => {
          res.body.status.should.equal('failure');
          res.body.error.should.equal(`unable to modify comment, ${err}`);
        });
      });
  });
  it('Should be able to flag/unflag a specific comment belonging to an article/gif', () => {
    request(app).patch(`/api/v1/feed/${articleId}/comments/${commentId}`)
      .set('Authorization', loggedInToken)
      .send({
        isFlagged: true,
      })
      .expect(200)
      .then((res) => {
        res.body.status.should.equal('success');
        res.body.data.message.should.equal('Comment successfully updated');
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
