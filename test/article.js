/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

const request = require('supertest');
const { expect } = require('chai');
const { loggedInToken, loggedInUserId } = require('./user');
const app = require('../app');
const { query } = require('../config/db');

const requestBody = {
  title: 'Technology advancement',
  article: 'The uprising of technology in our world today',
  userId: loggedInUserId,
  category: ['cat1', 'cat2'],
};

const modifiedRequestBody = {
  title: 'Modified: The enterprise of development',
  article: 'The uprising of technology in our world today',
  userId: loggedInUserId,
};

let articleId;
describe('POST /api/v1/articles', () => {
  it('Should be able to post an article to the database', () => {
    const { title, article, userId } = requestBody;
    request(app).post('/api/v1/articles')
      .set('Authorization', loggedInToken)
      .send(requestBody)
      . query(`INSERT INTO feeds(Title, Content, UserID, Type, Category, IsFlagged)
      VALUES ($1, $2, $3, 'article', $4, false) RETURNING *`, [title, [article], userId, category])
      .then((res) => {
        res.status(201).should.exist;
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
      });
    const { userId } = requestBody;
    query('DELETE FROM feeds WHERE (id=$1 AND userId=$2)', [articleId, userId])
      .then((res) => {
        res.status.should.be(200);
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
  it('Should be able to modify an article and be updated in the database', () => {
    request(app).patch(`/api/v1/articles/${articleId}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', loggedInToken)
      .send(modifiedRequestBody);
    const { title, article, userId } = modifiedRequestBody;
    query(`UPDATE feeds SET title = $1, Content = $2 WHERE (id=$3 AND userId=$4)
      RETURNING *`, [title, article, articleId, userId])
      .then((res) => {
        res.status.should.be(201);
        res.body.status.should.equal('success');
        res.body.data.message.should.equal('Article successfully updated');
        res.body.data.title.should.exist;
        res.body.data.article.should.exist;
      })
      .catch((err) => {
        expect((res) => {
          res.status(404).json.should.be.a('object');
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
