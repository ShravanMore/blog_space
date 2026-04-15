import mysql from 'mysql2';

const dbConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Mysql@2005',
  database: process.env.DB_NAME || 'blog',
  port: process.env.DB_PORT || 3306,
  connectTimeout: 60000, // 60 seconds
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: true
  } : false
};

const db = mysql.createConnection(dbConfig);

// Handle connection errors
db.on('error', (err) => {
  console.error('Database error:', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ETIMEDOUT') {
    console.log('Attempting to reconnect to database...');
  }
});

// Test connection
db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    console.error('Connection config:', {
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      database: dbConfig.database,
      ssl: dbConfig.ssl
    });
  } else {
    console.log('Successfully connected to database');
  }
});

export default db;