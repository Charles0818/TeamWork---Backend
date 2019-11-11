/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

const request = require('supertest');
const { expect } = require('chai');
const { loggedInToken, loggedInUserId } = require('./user');
const app = require('../app');

let articleId;
describe('POST /api/v1/articles', () => {
  it('Should be able to post an article to the database', () => {
    request(app).post('/api/v1/articles')
      .set('Authorization', loggedInToken)
      .send({
        title: 'Technology advancement',
        article: 'The uprising of technology in our world today',
        userId: loggedInUserId,
      })
      .expect(201)
      .then((res) => {
        res.body.status.should.equal('success');
        res.body.data.message.should.equal('Article successfully posted');
        articleId = res.body.data.articleId;
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
describe('DELETE /api/v1/articles/:id', () => {
  it('Should be able to delete an article from the database', () => {
    request(app).delete(`/api/v1/articles/${articleId}`)
      .set('Authorization', loggedInToken)
      .send({
        userId: 5,
      })
      .expect(200)
      .then((res) => {
        res.body.status.should.equal('success');
        res.body.data.message.should.equal('Article successfully deleted');
      })
      .catch((err) => {
        expect(400);
        expect((res) => {
          res.body.status.should.equal('failure');
          res.body.error.should.equal(`Could not delete article, ${err}`);
        });
      });
  });
});
describe('PATCH /api/v1/articles/:id', () => {
  it('Should be able to delete an article from the database', () => {
    request(app).patch(`/api/v1/articles/${articleId}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', loggedInToken)
      .send({
        title: 'Modified: The enterprise of development',
        article: 'The uprising of technology in our world today',
        userId: loggedInUserId,
      })
      .expect(200)
      .then((res) => {
        res.body.status.should.equal('success');
        res.body.data.message.should.equal('Article successfully updated');
        res.body.data.title.should.exist;
        res.body.data.article.should.exist;
      })
      .catch((err) => {
        expect(400);
        expect((res) => {
          res.body.status.should.equal('failure');
          res.body.error.should.equal(`Could not update article, ${err}`);
        });
      });
  });
});
describe('GET /api/v1/articles/:id', () => {
  it('Should be able to retrieve a specific article upon request', () => {
    request(app).get(`/api/v1/articles/${articleId}`)
      .set('Content-Type', 'application/json')
      .expect(200)
      .then((res) => {
        res.body.status.should.be('success');
        res.body.data.content.should.not.be.empty;
        res.body.data.comments.should.exists;
      })
      .catch((error) => {
        expect(404);
        expect((res) => {
          res.body.status.should.equal('failure');
          res.body.error.should.equal(`Unable to view article with id: ${articleId}, ${error}`);
        });
      });
  });
});

module.exports = { articleId };
