/* eslint-disable comma-dangle */
const { query } = require('../config/db');

exports.postComment = (req, res) => {
  const { contentID } = req.params;
  const { comment, userID } = req.body;
  query(`INSERT INTO comments(
            comment,
            UserID,
            contentID
        ) VALUES ($1, $2, $3) RETURNING *`, [comment, userID, contentID])
    .then((result) => res.status(201).json({
      status: 'success',
      data: {
        message: 'Comment successfully posted',
        contentID: result.rows[0].contentid,
        commentID: result.rows[0].id,
        comments: result.rows[0].comment,
        createdOn: result.rows[0].createdOn
      }
    }))
    .catch((err) => res.status(400).json({ error: err }));
};

exports.deleteComment = (req, res) => {
  const { commentId } = req.params;
  query('DELETE FROM comments WHERE id=$1', [commentId])
    .then(() => res.status(200).json({ message: 'Comment successfully deleted' }))
    .catch((err) => res.status(400).json({ error: `Could not delete Comment, ${err}` }));
};

exports.modifyComment = (req, res) => {
  const { commentId } = req.params;
  const { comment } = req.body;
  query('UPDATE comments SET comment = $1 WHERE id = $2 RETURNING *', [comment, commentId])
    .then((result) => res.status(201).json({
      status: 'success',
      data: {
        message: ' Comment successfully updated ',
        comment: result.rows[0].comment,
        commentID: result.rows[0].id,
      }
    }))
    .catch((error) => res.status(404).json({ error }));
};
