/* eslint-disable comma-dangle */
const { query } = require('../config/db');

exports.postComment = (req, res) => {
  const { contentId } = req.params;
  const { comment, userId } = req.body;
  query(`INSERT INTO comments(
            comment,
            UserID,
            contentID,
            IsFlagged
        ) VALUES ($1, $2, $3, false) RETURNING *`, [comment, userId, contentId])
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
  const { commentId } = req.params;
  query('DELETE FROM comments WHERE id=$1', [commentId])
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
  const { commentId } = req.params;
  const { comment } = req.body;
  query('UPDATE comments SET comment = $1 WHERE id = $2 RETURNING *', [comment, commentId])
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

exports.flagComment = (req, res) => {
  const { commentId } = req.params;
  const { isFlagged } = req.body;
  query('UPDATE comments SET isFlagged = $1 WHERE id = $2 RETURNING IsFlagged', [isFlagged, commentId])
    .then((result) => res.status(201).json({
      status: 'success',
      message: 'Comment successfully updated',
      data: result
    }))
    .catch((error) => res.status(404).json({
      status: 'failure',
      error
    }));
};
