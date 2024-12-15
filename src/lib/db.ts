import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "ccams_db",
  waitForConnections: true,
  connectionLimit: 20,
  maxIdle: 5,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

export default pool; 