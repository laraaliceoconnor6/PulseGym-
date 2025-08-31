//backend code
const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
app.use(cors());
app.use(express.json());

//ADD MEMBER
app.post('/members', (req, res) => {
    const { first_name, last_name, date_joined, membership_type, bank_account } = req.body;
    const sql = `INSERT INTO Members (first_name, last_name, date_joined, membership_type, bank_account) VALUES (?, ?, ?, ?, ?)`;
    db.run(sql, [first_name, last_name, date_joined, membership_type, bank_account], function(err){
        if(err) return res.status(400).json({ error: err.message });
        res.json({ message: 'Member added', id: this.lastID });
    });
});

//VIEW MEMBER
app.get('/members', (req, res) => {
    db.all(`SELECT * FROM Members`, [], (err, rows) => {
        if(err) return res.status(400).json({ error: err.message });
        res.json(rows);
    });
});

//UPDATE MEMBER
app.put('/members/:id', (req, res) => {
    const { first_name, last_name, date_joined, membership_type, bank_account } = req.body;
    const { id } = req.params;
    const sql = `UPDATE Members SET first_name=?, last_name=?, date_joined=?, membership_type=?, bank_account=? WHERE member_id=?`;
    db.run(sql, [first_name, last_name, date_joined, membership_type, bank_account, id], function(err){
        if(err) return res.status(400).json({ error: err.message });
        res.json({ message: 'Member updated' });
    });
});

//DELETE MEMBER
app.delete('/members/:id', (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM Members WHERE member_id=?`, [id], function(err){
        if(err) return res.status(400).json({ error: err.message });
        res.json({ message: 'Member deleted' });
    });
});




//ADD TRAINER
app.post('/trainers', (req, res) => {
    const { first_name, last_name, date_joined, speciality } = req.body;
    const sql = `INSERT INTO Trainers (first_name, last_name, date_joined, speciality) VALUES (?, ?, ?, ?)`;
    db.run(sql, [first_name, last_name, date_joined, speciality], function(err){
        if(err) return res.status(400).json({ error: err.message });
        res.json({ message: 'Trainer added', id: this.lastID });
    });
});

//VIEW TRAINER
app.get('/trainers', (req, res) => {
    db.all(`SELECT * FROM Trainers`, [], (err, rows) => {
        if(err) return res.status(400).json({ error: err.message });
        res.json(rows);
    });
});

//UPDATE TRAINER
app.put('/trainers/:id', (req, res) => {
    const { first_name, last_name, date_joined, speciality } = req.body;
    const { id } = req.params;
    const sql = `UPDATE Trainers SET first_name=?, last_name=?, date_joined=?, speciality=? WHERE trainer_id=?`;
    db.run(sql, [first_name, last_name, date_joined, speciality, id], function(err){
        if(err) return res.status(400).json({ error: err.message });
        res.json({ message: 'Trainer updated' });
    });
});

//DELETE TRAINER
app.delete('/trainers/:id', (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM Trainers WHERE trainer_id=?`, [id], function(err){
        if(err) return res.status(400).json({ error: err.message });
        res.json({ message: 'Trainer deleted' });
    });
});

//ADD CLASS
app.post('/classes', (req, res) => {
  const { class_name, class_day, class_time, trainer_id, max_members } = req.body;
  const sql = `INSERT INTO Classes (class_name, class_day, class_time, trainer_id, max_members) VALUES (?, ?, ?, ?, ?)`;
  db.run(sql, [class_name, class_day, class_time, trainer_id, max_members], function(err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ message: 'Class added', id: this.lastID });
  });
});


//VIEW CLASS
app.get('/classes', (req, res) => {
    const sql = `
        SELECT c.class_id, c.class_name, c.class_day, c.class_time, c.max_members,
               t.first_name || ' ' || t.last_name AS trainer_name
        FROM Classes c
        LEFT JOIN Trainers t ON c.trainer_id = t.trainer_id
    `;
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(400).json({ error: err.message });
        res.json(rows);
    });
});


//UPDATE CLASS
app.put('/classes/:id', (req, res) => {
  const { class_name, class_day, class_time, trainer_id, max_members } = req.body;
  const { id } = req.params;
  const sql = `UPDATE Classes SET class_name=?, class_day=?, class_time=?, trainer_id=?, max_members=? WHERE class_id=?`;
  db.run(sql, [class_name, class_day, class_time, trainer_id, max_members, id], function(err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ message: 'Class updated' });
  });
});

//DELETE CLASS
app.delete('/classes/:id', (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM Classes WHERE class_id=?`, [id], function(err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ message: 'Class deleted' });
  });
});



//export app for testing (JEST)
module.exports = app;


//Start server only if run directly
if (require.main === module) {
    app.listen(3000, () => console.log('Server running on http://localhost:3000'));
}