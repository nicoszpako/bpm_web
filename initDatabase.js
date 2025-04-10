import Database from 'better-sqlite3';

// Initialize the database
const db = new Database('database.sqlite');

// Example: Create a table
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    code TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
  )
`);

console.log("Database initialized successfully.");
