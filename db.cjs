// Using ES module syntax for importing 'better-sqlite3'
import Database from 'better-sqlite3';

// Initialize the database
const db = new Database('database.sqlite');

// Export the database instance using ES module syntax
export default db;
