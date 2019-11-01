/* eslint-disable comma-dangle */
const { query } = require('../config/db');

exports.postArticle = (req, res) => {
  const { title, article } = req.body;
  query(`INSERT INTO articles(
            Title,
            Article,
            UserID
        ) VALUES ($1, $2, $3) RETURNING *`, [title, article, req.body.userID])
    .then((result) => res.status(201).json({
      status: 'success',
      data: {
        message: 'Article successfully posted',
        articleID: result.rows[0].id,
        createdOn: result.rows[0].CreatedOn,
        title: result.rows[0].Title
      }
    }))
    .catch((err) => res.status(400).json({ error: err }));
};

exports.deleteArticle = (req, res) => {
  const { id } = req.params;
  query(`DELETE FROM articles WHERE id=$1 (
        Title,
        Article,
        UserID
    )`, [id])
    .then(() => res.status(200).json({ message: 'Article successfully deleted' }))
    .catch((err) => res.status(400).json({ error: `Could not delete article, ${err}` }));
};

exports.modifyArticle = (req, res) => {
  const { id } = req.params;
  const { title, article, userID } = req.body;
  query('UPDATE articles SET Title = $1, Article = $2 WHERE id = $3, UserID = $4', [title, article, id, userID]) // Not correct
    .then((result) => res.status(201).json({
      status: 'success',
      data: {
        message: ' Article successfully updated ',
        title: result.rows[0].Title,
        article: result.rows[0].Article,
      }
    }));
};
