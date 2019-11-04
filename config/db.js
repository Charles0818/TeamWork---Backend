/* eslint-disable no-console */
const { Pool } = require('pg');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';
const {
  DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_DATABASE,
} = process.env;
const connectionString = `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}`;


const pool = new Pool({
  connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
  ssl: isProduction,
});
pool.connect().then(() => console.log('Connected to the database'))
  .catch((err) => console.log(`Unable to connect to database, ${err}`));

const query = (text, params) => pool.query(text, params);

module.exports = { pool, query };
