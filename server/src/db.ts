import Database from 'bun:sqlite';

const db = new Database("db.db")
let query = db.query(`INSERT INTO user("username", "password") VALUES("zortinon", "goirgtut45")`)
query.run();