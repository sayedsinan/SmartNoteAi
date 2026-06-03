const db =require('../database/db');
const noteService = {};

noteService.createNote = (title, content, callback) => {
    const query = 'INSERT INTO notes (title, content) VALUES (?, ?)';
    db.query(query, [title, content], (err, result) => {
        if (err) {
            return callback(err);
        }
        callback(null, result.insertId);
    });
};

noteService.getAllNotes = (callback) => {
    const query = 'SELECT * FROM notes';
    db.query(query, (err, results) => {
        if (err) {
            return callback(err);
        }
        callback(null, results);
    });
};

noteService.getNoteById = (id, callback) => {
    const query = 'SELECT * FROM notes WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            return callback(err);
        }  
        callback(null, results[0]);
    });
};

noteService.updateNote = (id, title, content, callback) => {       

    const query = 'UPDATE notes SET title = ?, content = ? WHERE id = ?';
    db.query(query, [title, content, id], (err, result) => {
        if (err) {
            return callback(err);
        }
        callback(null, result.affectedRows);
    });
 }
 noteService.deleteNote = (id, callback) => {
    const query = 'DELETE FROM notes WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            return callback(err);
        }
        callback(null, result.affectedRows);
    });
};