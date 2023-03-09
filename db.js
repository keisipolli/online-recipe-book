const sqlite3 = require('sqlite3').verbose();

function connect() {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database('database.sqlite', (err) => {
            if (err) {
                reject(err);
            } else {
                console.log('Connected to the database.');
                resolve(db);
            }
        });
    });
}

module.exports = { connect };