/* eslint-disable comma-dangle */
const { query } = require('../config/db');

exports.getAllPosts = (req, res) => {
  query('SELECT * FROM feeds ORDER BY CreatedOn DESC;')
    .then((result) => res.status(200).json({
      status: 'success',
      data: [...result.rows]
    }))
    .catch((error) => res.status(404).json({
      error: `Unable to display all posts, ${error}`
    }));
};

exports.flag = (req, res) => {
  query(`UPDATE feeds SET IsFlagged=$1 WHERE id=$2
  RETURNING IsFlagged`, [req.body.isFlagged, req.params.id])
    .then((result) => res.status(201).json({
      status: 'success',
      data: result
    })).catch((err) => res.status(400).json({
      status: 'failure',
      error: err
    }));
};
