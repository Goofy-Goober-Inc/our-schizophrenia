import Database from 'bun:sqlite';

const db = new Database("db.db")
let query = db.query(`INSERT INTO user("username", "password") VALUES("DedAkim", "123456789")`)
query.run();
query = db.query(`INSERT INTO user("username", "password") VALUES("Юлечка Гаврилина", "123456")`)
query.run();