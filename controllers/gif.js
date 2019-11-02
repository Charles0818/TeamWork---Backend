/* eslint-disable prefer-destructuring */
/* eslint-disable comma-dangle */
const { query } = require('../config/db');
const cloudinary = require('../config/cloudinary');

exports.getAllGifs = (req, res) => {
  query('SELECT * FROM gifs')
    .then((result) => res.status(200).json(result))
    .catch((err) => res.status(400).json({ error: err }));
};

exports.getOneGif = (req, res) => {
  query('SELECT * FROM gifs WHERE id=$1', [req.params.id])
    .then((result) => res.status(200).json({
      status: 'success',
      data: {
        id: 'Integer',
        createdOn: 'DateTime',
        title: String,
        article: String,
        comments: [...result.rows.comments]
      }
    }));
};

exports.postGif = (req, res) => {
  req.body.gif = JSON.parse(req.body.gif);
  const imageFile = req.files.path;
  console.log(imageFile);
  const { title } = req.body;
  // Upload file to Cloudinary
  cloudinary.upload(imageFile)
    .then((image) => {
      query(`INSERT INTO feeds(
            Title,
            Content,
            UserID
        ) VALUES ($1, $2, $3, 'gif');
        INSERT INTO cloudinary(
          PublicID,
          URL
        ) VALUES ($2, $4);`, [title, image.public_id, req.params.id, image.url])
        .then((result) => res.status(201).json({
          status: 'success',
          data: {
            gifId: result.rows[0].ImageID,
            message: 'GIF image successfully posted',
            createdOn: result.rows[0].CreatedOn,
            title: result.rows[0].Title,
            imageUrl: result.rows[0].ImageUrl
          }
        }))
        .catch((err) => res.status(400).json({ error: `unable to connect to database, ${err}` }));
    }).catch((err) => res.status(400).json({ error: `Unable to connect to cloud storage, ${err}` }));
};

exports.deleteGif = (req, res) => {
  const gifId = req.params.id;
  const publicID = req.body.public_id;
  cloudinary.delete(publicID)
    .then(() => query('DELETE FROM feeds WHERE ImageID=$3', [gifId])
      .then(() => res.status(200).json({ message: 'GIF was successfully deleted' })))
    .catch((err) => res.status(400).json({ error: err }));
};
