/* eslint-disable comma-dangle */
const { query } = require('../config/db');

const flagQuery = (req, res, table) => {
  const { userId, isFlagged } = req.body;
  const { id, commentId } = req.params;
  const ref = id ? 'ContentID' : 'CommentID';
  const refId = id || commentId;
  if (isFlagged) {
    return (
      query(`INSERT INTO ${table} (${ref}, UserID)
      VALUES($1, $2) RETURNING *;`, [refId, userId])
    );
  }

  return (
    query(`DELETE FROM ${table} WHERE (${ref}=$1 AND UserID=$2) RETURNING *;`, [refId, userId])
  );
};

module.exports = { flagQuery };
