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
        contentId: result.rows[0].contentid,
        commentId: result.rows[0].id,
        comments: result.rows[0].comment,
        createdOn: result.rows[0].createdOn
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
        comment: result.rows[0].comment,
        commentId: result.rows[0].id,
      }
    }))
    .catch((error) => res.status(404).json({
      status: 'failure',
      error: `unable to modify comment, ${error}`
    }));
};

exports.count = (req, res) => {
  const { contentId } = req.params;
  query('SELECT COUNT(*) FROM comments WHERE contentID =$1', [contentId])
    .then((result) => res.status(201).json({
      status: 'success',
      data: {
        length: result.rows
      }
    }))
    .catch((error) => res.status(404).json({
      status: 'failure',
      error: `unable to validate number of comments, ${error}`
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
