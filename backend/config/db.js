const mysql = require('mysql2/promise');

// Support both custom vars and Railway/cloud MySQL vars (MYSQL_URL, MYSQL_HOST, etc.)
const config = process.env.MYSQL_URL
  ? { uri: process.env.MYSQL_URL }
  : {
      host: process.env.DB_HOST || process.env.MYSQL_HOST || 'localhost',
      user: process.env.DB_USER || process.env.MYSQL_USER || 'root',
      password: process.env.DB_PASSWORD || process.env.MYSQL_PASSWORD || '',
      database: process.env.DB_NAME || process.env.MYSQL_DATABASE || 'task_management',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    };

const pool = process.env.MYSQL_URL
  ? mysql.createPool(process.env.MYSQL_URL)
  : mysql.createPool(config);

module.exports = pool;
