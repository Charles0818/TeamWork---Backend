/* eslint-disable comma-dangle */
const { query } = require('../config/db');
const { flagQuery } = require('./flagQuery');

exports.postComment = (req, res) => {
  const { contentId } = req.params;
  const { comment, userId } = req.body;
  query(`INSERT INTO comments(
            comment,
            UserID,
            contentID
        ) VALUES ($1, $2, $3) RETURNING *`, [comment, userId, contentId])
    .then((result) => res.status(201).json({
      status: 'success',
      data: {
        message: 'Comment successfully posted',
        commentDetails: result.rows[0],
      }
    }))
    .catch((err) => res.status(400).json({
      status: 'failure',
      error: err
    }));
};

exports.deleteComment = (req, res) => {
  const { commentId, contentId } = req.params;
  query('DELETE FROM comments WHERE (id=$1 AND contentID = $2)', [commentId, contentId])
    .then(() => res.status(200).json({
      status: 'success',
      message: 'Comment successfully deleted'
    }))
    .catch((err) => res.status(400).json({
      status: 'failure',
      error: `Could not delete Comment, ${err}`
    }));
};

exports.modifyComment = (req, res) => {
  const { commentId, contentId } = req.params;
  const { comment } = req.body;
  query('UPDATE comments SET comment = $1 (WHERE id = $2 AND contentID =$3) RETURNING *', [comment, commentId, contentId])
    .then((result) => res.status(201).json({
      status: 'success',
      data: {
        message: 'Comment successfully updated',
        commentDetails: result.rows[0],
      }
    }))
    .catch((error) => res.status(404).json({
      status: 'failure',
      error: `unable to modify comment, ${error}`
    }));
};

exports.flag = (req, res) => {
  flagQuery(req, res, 'commentFlag')
    .then((result) => res.status(201).json({
      status: 'success',
      data: result.rows[0]
    })).catch((err) => res.status(400).json({
      status: 'failure',
      error: `!!!Operation failed, ${err}`
    }));
};

exports.getFlagStats = (req, res) => {
  const { commentId } = req.params;
  query('SELECT * FROM commentFlag WHERE CommentID =$1;', [commentId])
    .then((result) => res.status(200).json({
      status: 'success',
      data: {
        flagStats: result.rows
      }
    })).catch((err) => res.status(400).json({
      status: 'failure',
      error: err
    }));
};
