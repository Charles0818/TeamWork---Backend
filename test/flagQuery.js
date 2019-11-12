/* eslint-disable comma-dangle */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

const request = require('supertest');
const { expect } = require('chai');
const { query } = require('../config/db');

const req = {
  header: {},
  params: {
    id: 1,
  },
  body: {
    userId: 1,
    isFlagged: true,
  },
  table: 'feedFlag'
};
describe('a controller for flagging an article/gif/comment', () => {
  const { userId, isFlagged } = req.body;
  const { id } = req.params;
  const { table } = req;
  const ref = id ? 'ContentID' : '';
  const refId = id || null;
  it('Should be able to flag/unflag an article/gif/comment', () => {
    if (isFlagged) {
      return (
        query(`INSERT INTO ${table} (${ref}, UserID)
      VALUES($1, $2) RETURNING *;`, [refId, userId])
      );
    }
    return (
      query(`DELETE FROM ${table} WHERE (${ref}=$1 AND UserID=$2) RETURNING *;`, [refId, userId])
    );
  });
});
