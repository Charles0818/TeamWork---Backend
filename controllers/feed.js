/* eslint-disable comma-dangle */
const { query } = require('../config/db');

exports.getAllPosts = (req, res) => {
  query('SELECT * FROM feeds ORDER BY CreatedOn DESC;')
    .then((result) => res.status(200).json({
      status: 'success',
      data: [...result.rows]
    }))
    .catch((error) => res.status(404).json({ error: `Unable to display all posts, ${error}` }));
};
