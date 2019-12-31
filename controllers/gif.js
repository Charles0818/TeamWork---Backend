/* eslint-disable prefer-destructuring */
/* eslint-disable comma-dangle */
const { query } = require('../config/db');
const cloudinary = require('../config/cloudinary');


exports.getOneGif = (req, res) => {
  const { id } = req.params;
  query(
    `SELECT DISTINCT id, title, content, type, userID, category, createdOn
    FROM feeds WHERE (id=$1 AND type='gif');`, [id]
  )
    .then((content) => {
      query(`SELECT id, comment, contentID, userID, createdOn from comments
    WHERE contentID = $1`, [content.rows[0].id])
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
      error: `Unable to view gif with id: ${id}, ${error}`
    }));
};

exports.postGif = (req, res) => {
  const file = req.files[0].path;
  const { title, userId, category } = req.body;
  // Upload file to Cloudinary
  cloudinary.upload(file)
    .then((image) => {
      const imageDetails = [
        image.url,
        image.public_id
      ];
      query(`INSERT INTO feeds (Title, Content, UserID, Type, Category )
      VALUES ($1, $2, $3, 'gif', $4 ) RETURNING *;`, [title, imageDetails, userId, category])
        .then((result) => res.status(201).json({
          status: 'success',
          data: {
            message: 'GIF image successfully posted',
            feed: result.rows[0],
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
  const { gifId, publicId, userId } = req.params;
  cloudinary.delete(publicId)
    .then(() => query("DELETE FROM feeds WHERE (id=$1 AND userID=$2 AND type='gif')", [gifId, userId])
      .then(() => res.status(200).json({ message: 'GIF was successfully deleted' })))
    .catch((err) => res.status(400).json({ error: err }));
};
