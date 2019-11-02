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
    `SELECT feeds.id,
      title,
      content
    FROM
      feeds
    INNER JOIN comments ON comments.ContentID = feeds.id
    WHERE feeds.id=$1;
    `, [id]
  )
    .then((result) => res.status(200).json({
      result
      // status: 'success',
      // data: {
      //   id: result.rows[0].id,
      //   createdOn: result.rows[0].createdOn,
      //   article: result.rows[0].content,
      //   title: result.rows[0].title,
      //   comments: [result.rows[0].comment]
      // }
    }))
    .catch((error) => res.status(404).json({ error: `Unable to view article with id: ${id}, ${error}` }));
};
