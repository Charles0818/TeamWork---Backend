/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

const request = require('supertest');
const { expect } = require('chai');
const { loggedInToken, loggedInUserId } = require('./user');
const app = require('../app');
const { articleId } = require('./article');
const { query } = require('../config/db');

const req = {
  header: {},
  params: {
    contentId: articleId,
    commentId: 1,
  },
  body: {
    comment: 'Science is evolving, so do i expect the mind to behave',
    userId: loggedInUserId,
  },
};

describe('Create, delete, modify and flag comments', () => {
  it('Should be able to Create comment under a specific article/gif', () => {
    const { contentId } = req.params;
    const { comment, userId } = req.body;
    request(app).post(`/api/v1/feed/${articleId}/comments`)
      .set('Content-Type', 'application/json')
      .set('Authorization', loggedInToken)
      .send(req.body)
      .query(`INSERT INTO comments(comment, userID, contentID, isFlagged)
      VALUES ($1, $2, $3, false) RETURNING *`, [comment, userId, contentId])
      .then((result) => {
        expect((res) => {
          res.status(201).should.exist;
          res.body.status.should.equal('success');
          res.body.data.should.be.a('object');
          res.body.data.message.should.equal('Comment successfully posted');
          res.body.data.contentId.should.exist;
          res.body.data.commentId.should.exist;
          res.body.data.comments.should.exist;
          res.body.data.comments.should.be.Array.Prototype;
          res.body.data.createdOn.should.exist;
        });
      })
      .catch((err) => {
        expect((res) => {
          res.status(400).should.exist;
          res.body.status.should.equal('failure');
          res.body.error.should.equal(err);
        });
      });
  });
  it('Should be able to delete a specific comment belonging to an article/gif', () => {
    const { commentId, contentId } = req.params;
    request(app).delete(`/api/v1/feed/${contentId}/comments/${commentId}`)
      .set('Authorization', loggedInToken)
      .query('DELETE FROM comments WHERE (id=$1 AND contentID = $2)', [commentId, contentId])
      .then((res) => {
        res.status(200).should.exist;
        res.body.status.should.equal('success');
        res.body.data.message.should.equal('Comment successfully deleted');
      })
      .catch((err) => {
        expect((res) => {
          res.status(200).should.exist;
          res.body.status.should.equal('failure');
          res.body.error.should.equal(`could not delete comment, ${err}`);
        });
      });
  });
  it('Should be able to modify a specific comment belonging to an article/gif', () => {
    const { commentId, contentId } = req.params;
    request(app).patch(`/api/v1/feed/${contentId}/comments/${commentId}`)
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
    const { commentId, contentId } = req.params;
    request(app).patch(`/api/v1/feed/${contentId}/comments/${commentId}`)
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
