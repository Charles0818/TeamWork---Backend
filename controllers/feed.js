/* eslint-disable comma-dangle */
const { query } = require('../config/db');
const { flagQuery } = require('./flagQuery');

exports.getAllPosts = (req, res) => {
  query('SELECT * FROM feeds ORDER BY CreatedOn DESC;')
    .then((result) => {
      query(`SELECT id, comment, contentID, userID, createdOn
       FROM comments;`)
        .then((comments) => {
          query('SELECT * from feedFlag;')
            .then((flags) => {
              res.status(200).json({
                status: 'success',
                data: {
                  content: result.rows,
                  comments: comments.rows,
                  flags: flags.rows,
                }
              });
            });
        });
    })
    .catch((error) => res.status(404).json({
      error: `Unable to display all posts, ${error}`
    }));
};

exports.getAllPostsByAuthor = (req, res) => {
  const { employeeId } = req.params;
  query('SELECT * FROM feeds WHERE userID=$1 ORDER BY CreatedOn DESC;', [employeeId])
    .then((result) => {
      query(`SELECT id, comment, contentID, userID, createdOn
     FROM comments;`)
        .then((comments) => {
          query('SELECT * from feedFlag;')
            .then((flags) => {
              res.status(200).json({
                status: 'success',
                data: {
                  content: result.rows,
                  comments: comments.rows,
                  flags: flags.rows,
                }
              });
            });
        });
    })
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

exports.getFlagStats = (req, res) => {
  const { contentId } = req.params;
  query('SELECT * FROM feedFlag WHERE contentID =$1;', [contentId])
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
