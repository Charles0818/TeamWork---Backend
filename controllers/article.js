/* eslint-disable comma-dangle */
const { query } = require('../config/db');

exports.postArticle = (req, res) => {
  const {
    title, article, userId, category
  } = req.body;
  query(`
    INSERT INTO feeds (Title, Content, UserID, Type, Category)
    VALUES ($1, $2, $3, 'article', $4) RETURNING *`, [title, [article], userId, category])
    .then((result) => res.status(201).json({
      status: 'success',
      data: {
        message: 'Article successfully posted',
        feed: result.rows[0],
      }
    }))
    .catch((err) => res.status(400).json({
      status: 'failure',
      error: err
    }));
};

exports.deleteArticle = (req, res) => {
  const { id, userId } = req.params;
  query("DELETE FROM feeds WHERE (id=$1 AND userID=$2 AND type='article')", [id, userId])
    .then(() => res.status(200).json({
      status: 'success',
      message: 'Article successfully deleted'
    }))
    .catch((err) => res.status(400).json({
      status: 'failure',
      error: `Could not delete article, ${err}`
    }));
};

exports.modifyArticle = (req, res) => {
  const { id } = req.params;
  const {
    title, article, category, userId,
  } = req.body;
  query(`UPDATE feeds SET title = $1, Content = $2, Category=$3 WHERE (id=$4 AND userId=$5)
  RETURNING *`, [title, [article], category, id, userId])
    .then((result) => res.status(201).json({
      status: 'success',
      data: {
        message: 'Article successfully updated ',
        title: result.rows[0].title,
        article: result.rows[0].content,
        category: result.rows[0].category,
        createdOn: result.rows[0].createdOn,
      }
    }))
    .catch((err) => res.status(404).json({
      status: 'failure',
      error: `Unable to modify article, ${err}`
    }));
};

exports.getOneArticle = (req, res) => {
  const { id } = req.params;
  query(
    `SELECT DISTINCT id, title, content, type, category, userID, createdOn
    FROM feeds WHERE (id=$1 AND type='article');`, [id]
  )
    .then((content) => {
      query(`SELECT id, comment, contentID, userID, createdOn
       FROM comments WHERE contentID = $1`, [content.rows[0].id])
        .then((comments) => {
          query('SELECT * from feedFlag WHERE ContentID = $1;', [content.rows[0].id])
            .then((flags) => {
              res.status(200).json({
                status: 'success',
                data: {
                  content: content.rows[0],
                  comments: comments.rows,
                  flags: flags.rows,
                }
              });
            });
        });
    })
    .catch((error) => res.status(404).json({
      status: 'failure',
      error: `Unable to view article with id: ${id}, ${error}`
    }));
};
