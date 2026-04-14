import mysql from 'mysql2';

const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'Mysql@2005',
  database: 'blog',
})

export default db;