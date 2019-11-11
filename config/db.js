const { Pool } = require('pg');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';
const connectionString = 'postgresql://postgres:charlieboy@localhost:5432/teamwork';

const pool = new Pool({
  connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
  ssl: isProduction,
});
pool.connect().then(() => console.log('Connected to database'))
  .catch((err) => console.log(`Unable to connect to database, ${err}`));

const query = (text, params) => pool.query(text, params);

module.exports = { pool, query };
