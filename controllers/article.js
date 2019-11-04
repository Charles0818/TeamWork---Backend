/* eslint-disable comma-dangle */
const { query } = require('../config/db');

exports.postArticle = (req, res) => {
  const { title, article, userID } = req.body;
  query(`
    INSERT INTO feeds(
        Title,
        Content,
        UserID,
        Type
    ) VALUES ($1, $2, $3, 'text') RETURNING *`, [title, article, userID])
    .then((result) => res.status(201).json({
      status: 'success',
      data: {
        message: 'Article successfully posted',
        articleID: result.rows[0].id,
        title: result.rows[0].title,
        createdOn: result.rows[0].createdOn
      }
    }))
    .catch((err) => res.status(400).json({ error: err }));
};

exports.deleteArticle = (req, res) => {
  const { id } = req.params;
  query('DELETE FROM feeds WHERE id=$1', [id])
    .then(() => res.status(200).json({ message: 'Article successfully deleted' }))
    .catch((err) => res.status(400).json({ error: `Could not delete article, ${err}` }));
};

exports.modifyArticle = (req, res) => {
  const { id } = req.params;
  const { title, article } = req.body;
  query(`UPDATE feeds SET title = $1, Content = $2 WHERE id = $3
  RETURNING *`, [title, article, id]) // Not correct
    .then((result) => res.status(201).json({
      status: 'success',
      data: {
        message: ' Article successfully updated ',
        title: result.rows[0].title,
        article: result.rows[0].content
      }
    }))
    .catch((error) => res.status(404).json({ error }));
};

exports.getOneArticle = (req, res) => {
  const { id } = req.params;
  query(
    `SELECT DISTINCT id, title, content, type, createdOn
    FROM feeds WHERE (id=$1 AND type='text');`, [id]
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
    .catch((error) => res.status(404).json({ error: `Unable to view article with id: ${id}, ${error}` }));
};
