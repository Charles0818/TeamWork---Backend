/* eslint-disable consistent-return */
/* eslint-disable no-undef */
/* eslint-disable no-unused-expressions */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { query } = require('../config/db');

exports.createUser = (req, res) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      const {
        firstName, lastName, email, gender, jobRole, department, address,
      } = req.body;
      const password = hash;
      const props = `INSERT INTO users(
            firstName, 
            lastName, 
            email, 
            password, 
            gender, 
            jobRole, 
            department, 
            address
        ) 
        VALUES($1, $2, $3, $4, $5)
        RETURNING *`;
      const values = [firstName, lastName, email, password, gender, jobRole, department, address];

      query(props, values, (error, result) => {
        // done();
        if (error) {
          res.status(500).json({
            status: 'error',
            error: 'User account creation failed',
          });
        }
        res.status(201).json({
          status: 'success',
          data: {
            message: 'User account successfully created',
            token: req.headers.authorization.split(' ')[1],
            userId: result.rows[0].id, // cross check
          },
        });
      });
    });
};

exports.login = (req, res) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }
      bcrypt.compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) return res.status(401).json({ error: 'Incorrect Password' });
          const token = jwt.sign({ userId: user.id }, 'RANDOM_TOKEN_SECRET', { expiresIn: '24h' });
          res.status(200).json({
            status: 'success',
            data: {
              userId: user.id,
              token,
            },
          });
        }).catch((error) => {
          res.status(500).json({ error });
        });
    }).catch((error) => res.status(500).json({ error }));
};

exports.deleteUser = (req, res) => {
  const id = parseInt(req.params.id, 10);
  query('DELETE FROM users WHERE id=$1', [id])
    .then(() => res.status(200).json(`User with ID: ${id} was successfully deleted`))
    .catch((err) => res.status(400).json({ error: err }));
};
