/* eslint-disable comma-dangle */
const { query } = require('../config/db');
const { flagQuery } = require('./flagQuery');

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

exports.getAllPostsByAuthor = (req, res) => {
  const { employeeId } = req.params;
  query('SELECT * FROM feeds WHERE id=$1 ORDER BY CreatedOn DESC;', [employeeId])
    .then((result) => res.status(200).json({
      status: 'success',
      data: [...result.rows]
    }))
    .catch((error) => res.status(404).json({
      error: `Unable to display all posts, ${error}`
    }));
};

exports.flag = (req, res) => {
  flagQuery(req, res, 'feedflag')
    .then((result) => res.status(201).json({
      status: 'success',
      data: result.rows[0]
    })).catch((err) => res.status(400).json({
      status: 'failure',
      error: `!!!Operation failed, ${err}`
    }));
};
