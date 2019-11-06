/* eslint-disable consistent-return */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { query } = require('../config/db');
const cloudinary = require('../config/cloudinary');
require('dotenv').config();

exports.createUser = (req, res) => {
  const {
    firstName, lastName, email, gender, jobRole, department, address, accountType,
  } = req.body;
  let { password } = req.body;
  query('SELECT TRUE FROM users WHERE email=$1', [email])
    .then((boolValue) => {
      if (boolValue.rows[0].bool === true) {
        return res.status(400).json({ error: 'An exact email already exist in the database' });
      }
      if (boolValue.rows.length === 0 && boolValue.rows[0].bool === false) {
        bcrypt.hash(password, 10)
          .then((hash) => {
            password = hash;
            query(`INSERT INTO users (
          firstName, lastName, email, password, gender, jobRole, department, address, account_type
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`, [
              firstName, lastName, email, password,
              gender, jobRole, department, address, accountType])
              .then((result) => res.status(201).json({
                status: 'success',
                data: {
                  message: 'User account successfully created',
                  token: req.headers.authorization.split(' ')[1],
                  userId: result.rows[0].id, // cross check
                },
              }))
              .catch((err) => res.status(400).json({
                status: 'failure',
                error: `User account not created, ${err}`,
              }));
          });
      }
    })
    .catch((err) => res.status(400).json({
      status: 'failure',
      error: `User account creation failed, ${err} `,
    }));
};

exports.login = (req, res) => {
  query(`SELECT DISTINCT email, password, id FROM users WHERE EXISTS
  (SELECT TRUE FROM users WHERE email=$1)`, [req.body.email])
    .then((user) => {
      if (user.rows.length === 0) {
        return res.status(401).json({ error: 'User not found' });
      }
      bcrypt.compare(req.body.password, user.rows[0].password)
        .then((valid) => {
          if (!valid) return res.status(401).json({ error: 'Incorrect Password' });
          const token = jwt.sign({ userId: user.rows[0].id }, process.env.SECRET, { expiresIn: '24h' });
          res.status(200).json({
            status: 'success',
            data: {
              userId: user.rows[0].id,
              token,
            },
          });
        }).catch((error) => {
          res.status(500).json({ error });
        });
    }).catch((error) => res.status(500).json({
      status: 'failure',
      error,
    }));
};

exports.updateUserPic = (req, res) => {
  const file = req.files[0].path;
  const { userId } = req.params.userId;
  if (file) {
    // Upload file to Cloudinary
    let imageDetails = [];
    cloudinary.upload(file)
      .then((image) => {
        imageDetails = [
          image.url,
          image.public_id,
        ];
        query('UPDATE users SET PhotoDetails=$1 WHERE id=$2 RETURNING *;', [imageDetails, userId])
          .then((result) => res.status(201).json({
            status: 'success',
            data: {
              userId: result.rows[0].id,
              cloudId: result.rows[0].content[1],
              message: 'Profile Picture was successfully updated',
              photoUrl: result.rows[0].content[0],
            },
          }))
          .catch((err) => res.status(400).json({
            status: 'failure',
            error: `unable to connect to database, ${err}`,
          }));
      }).catch((err) => res.status(400).json({
        status: 'failure',
        error: `Unable to connect to cloud storage, ${err}`,
      }));
  }
};

exports.deleteUser = (req, res) => {
  const id = parseInt(req.params.id, 10);
  query('DELETE FROM users WHERE id=$1', [id])
    .then(() => res.status(200).json(`User with ID: ${id} was successfully deleted`))
    .catch((err) => res.status(400).json({
      status: 'failure',
      error: err,
    }));
};
