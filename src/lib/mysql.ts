import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || '131.153.147.50',
  user: process.env.MYSQL_USER || 'cashload_hackathon',
  password: process.env.MYSQL_PASSWORD || 'Trailer1234#',
  database: process.env.MYSQL_DATABASE || 'cashload_hackathon',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;