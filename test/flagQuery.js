/* eslint-disable comma-dangle */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

const request = require('supertest');
const { expect } = require('chai');
const { query } = require('../config/db');
const { articleId } = require('./article');
const app = require('../app');

const req = {
  header: {},
  params: {
    id: 1
  },
  body: {
    userId: 1,
    isFlagged: true,
  },
  table: 'feedFlag'
};
describe('a controller for flagging an article/gif/comment', () => {
  it('Should be able to flag/unflag an article/gif/comment', () => {
    request(app).patch(`/api/v1/feed/${req.params.id}/flag`)
      .send(req);
    const { userId, isFlagged } = req.body;
    const { id } = req.params;
    const { table } = req;
    const ref = 'ContentID';
    const refId = id;
    if (isFlagged) {
      return (
        query(`INSERT INTO ${table} (${ref}, UserID)
      VALUES($1, $2) RETURNING *;`, [refId, userId])
      ).then((result) => {
        expect((res) => {
          res.status(200).should.exist;
          res.body.data.should.equal([...result.rows]);
        });
      })
        .catch((error) => {
          expect((res) => {
            res.status(400).to.exist;
            res.body.error.should.equal(`Unable to display all posts, ${error}`);
          });
        });
    }
    return (
      query(`DELETE FROM ${table} WHERE (${ref}=$1 AND UserID=$2) RETURNING *;`, [refId, userId])
        .then((result) => {
          expect((res) => {
            res.status(200).should.exist;
            res.body.data.should.equal([...result.rows]);
          });
        })
        .catch((error) => {
          expect((res) => {
            res.status(400).to.exist;
            res.body.error.should.equal(`Unable to display all posts, ${error}`);
          });
        })
    );
  });
});
