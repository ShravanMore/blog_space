import mysql from 'mysql';

const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'Shravan@2005',
  database: 'blog',
})

export default db;