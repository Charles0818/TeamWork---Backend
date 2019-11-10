/* eslint-disable prefer-destructuring */
/* eslint-disable comma-dangle */
const { query } = require('../config/db');
const cloudinary = require('../config/cloudinary');


exports.getOneGif = (req, res) => {
  const { id } = req.params;
  query(
    `SELECT DISTINCT id, title, content, type, createdOn
    FROM feeds WHERE (id=$1 AND type='gif');`, [id]
  )
    .then((content) => {
      query(`SELECT id, comment, contentID, userID, createdOn from comments
    WHERE contentID = $1`, [content.rows[0].id])
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
      error: `Unable to view gif with id: ${id}, ${error}`
    }));
};

exports.postGif = (req, res) => {
  const file = req.files[0].path;
  const { title, userID } = req.body;
  // Upload file to Cloudinary
  cloudinary.upload(file)
    .then((image) => {
      const imageDetails = [
        image.url,
        image.public_id
      ];
      query(`INSERT INTO feeds (
            Title, Content, UserID, Type
        ) VALUES ($1, $2, $3, 'gif') RETURNING *;`, [title, imageDetails, userID])
        .then((result) => res.status(201).json({
          status: 'success',
          data: {
            gifId: result.rows[0].id,
            cloudId: result.rows[0].content[1],
            message: 'GIF image successfully posted',
            createdOn: result.rows[0].createdon,
            title: result.rows[0].title,
            imageUrl: result.rows[0].content[0]
          }
        }))
        .catch((err) => res.status(400).json({
          status: 'failure',
          error: `unable to connect to database, ${err}`
        }));
    }).catch((err) => res.status(400).json({
      status: 'failure',
      error: `Unable to connect to cloud storage, ${err}`
    }));
};

exports.deleteGif = (req, res) => {
  const gifId = req.params.id;
  const publicId = req.body.cloudId;
  cloudinary.delete(publicId)
    .then(() => query("DELETE FROM feeds WHERE (id=$1 AND type='gif')", [gifId])
      .then(() => res.status(200).json({ message: 'GIF was successfully deleted' })))
    .catch((err) => res.status(400).json({ error: err }));
};
