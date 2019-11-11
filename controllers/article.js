/* eslint-disable comma-dangle */
const { query } = require('../config/db');

exports.postArticle = (req, res) => {
  const {
    title, article, userId, category
  } = req.body;
  console.log([article]);
  query(`
    INSERT INTO feeds(Title, Content, UserID, Type, Category, IsFlagged)
    VALUES ($1, $2, $3, 'article', $4, false) RETURNING *`, [title, [article], userId, category])
    .then((result) => res.status(201).json({
      status: 'success',
      data: {
        message: 'Article successfully posted',
        articleId: result.rows[0].id,
        title: result.rows[0].title,
        category: result.rows[0].category,
        createdOn: result.rows[0].createdOn,
        isFlagged: result.rows[0].isflagged
      }
    }))
    .catch((err) => res.status(400).json({
      status: 'failure',
      error: err
    }));
};

exports.deleteArticle = (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  query('DELETE FROM feeds WHERE (id=$1 AND userId=$2)', [id, userId])
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
  const { title, article, userId } = req.body;
  query(`UPDATE feeds SET title = $1, Content = $2 WHERE (id=$3 AND userId=$4)
  RETURNING *`, [title, article, id, userId])
    .then((result) => res.status(201).json({
      status: 'success',
      data: {
        message: ' Article successfully updated ',
        title: result.rows[0].title,
        article: result.rows[0].content
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
    `SELECT DISTINCT id, title, content, type, createdOn
    FROM feeds WHERE (id=$1 AND type='article');`, [id]
  )
    .then((content) => {
      query(`SELECT id, comment, contentID, userID, createdOn
       FROM comments WHERE contentID = $1`, [content.rows[0].id])
        .then((comments) => res.status(200).json({
          status: 'success',
          data: {
            content: content.rows[0],
            comments: comments.rows
          }
        }));
    })
    .catch((error) => res.status(404).json({
      status: 'failure',
      error: `Unable to view article with id: ${id}, ${error}`
    }));
};
