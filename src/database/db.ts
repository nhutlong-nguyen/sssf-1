//added: import promise-based version of the msql2 client
import mysql from 'mysql2/promise';

//added: create pool of connections to the MySQL database with the given configuration
const promisePool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // Convert JSON fields to objects
  typeCast: function (field, next) {
    if (field.type === 'JSON') {
      return JSON.parse(field.string());
    }
    return next();
  },
});

// function to close pool
const closePool = async () => {
  await promisePool.end();
};

export {promisePool, closePool};
