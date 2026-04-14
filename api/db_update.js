import db from './db.js';

console.log("Running Database Migration...");

const queries = [
  "ALTER TABLE posts ADD COLUMN views INT DEFAULT 0;",
  `CREATE TABLE IF NOT EXISTS likes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    uid INT NOT NULL,
    pid INT NOT NULL,
    CONSTRAINT unq_like UNIQUE (uid, pid),
    FOREIGN KEY (uid) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (pid) REFERENCES posts(id) ON DELETE CASCADE
  );`
];

db.query(queries[0], (err) => {
  if (err && err.code !== 'ER_DUP_FIELDNAME') console.error("Views column error:", err.sqlMessage);
  else console.log("✅ Views column ensured.");
  
  db.query(queries[1], (err) => {
    if (err) console.error("Likes table error:", err.sqlMessage);
    else console.log("✅ Likes table ensured.");
    process.exit();
  });
});
