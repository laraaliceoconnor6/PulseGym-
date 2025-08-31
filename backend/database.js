const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('../PulseGym.db', (err) => {
    if (err) console.error('Database opening error: ', err);
    else console.log('Connected to PulseGym SQLite database.');
});

db.serialize(() => {
    //Members table (existing)
    db.run(`
        CREATE TABLE IF NOT EXISTS Members (
            member_id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            date_joined TEXT NOT NULL,
            membership_type TEXT NOT NULL,
            bank_account TEXT NOT NULL
        )
    `);

    
    //Trainers table
    db.run(`
        CREATE TABLE IF NOT EXISTS Trainers (
            trainer_id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            date_joined TEXT NOT NULL,
            speciality TEXT NOT NULL
        )
    `);





    //Classes table
    db.run(`
        CREATE TABLE IF NOT EXISTS Classes (
            class_id INTEGER PRIMARY KEY AUTOINCREMENT,
            class_name TEXT NOT NULL,
            class_day TEXT NOT NULL,
            class_time TEXT NOT NULL,
            trainer_id INTEGER NOT NULL,
            max_members INTEGER NOT NULL,
            FOREIGN KEY(trainer_id) REFERENCES Trainers(trainer_id)
        )
    `);
});

module.exports = db;
