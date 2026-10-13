const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    port: Number(process.env.DB_PORT) || 20089,
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'uni_club'
    ssl: {
    rejectUnauthorized: false
  },
});

const promisePool = pool.promise();

module.exports = promisePool;
