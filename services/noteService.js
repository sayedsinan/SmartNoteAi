const db = require('../database/db');

const noteService = {};

// Create Note
noteService.createNote = (
    title,
    original_notes,
    generated_content,
    difficulty_level,
    callback
) => {

    const query = `
        INSERT INTO notes
        (title, original_notes, generated_content, difficulty_level)
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        query,
        [
            title,
            original_notes,
            JSON.stringify(generated_content),
            difficulty_level
        ],
        (err, result) => {
            if (err) {
                return callback(err);
            }

            callback(null, result.insertId);
        }
    );
};

// Get All Notes
noteService.getAllNotes = (callback) => {

    db.query(
        'SELECT * FROM notes ORDER BY created_at DESC',
        (err, results) => {

            if (err) {
                return callback(err);
            }

            callback(null, results);
        }
    );
};

// Get Note By Id
noteService.getNoteById = (id, callback) => {

    db.query(
        'SELECT * FROM notes WHERE id = ?',
        [id],
        (err, results) => {

            if (err) {
                return callback(err);
            }

            callback(null, results[0]);
        }
    );
};

// Update Note
noteService.updateNote = (
    id,
    title,
    original_notes,
    generated_content,
    difficulty_level,
    callback
) => {

    const query = `
        UPDATE notes
        SET title = ?,
            original_notes = ?,
            generated_content = ?,
            difficulty_level = ?
        WHERE id = ?
    `;

    db.query(
        query,
        [
            title,
            original_notes,
            JSON.stringify(generated_content),
            difficulty_level,
            id
        ],
        (err, result) => {

            if (err) {
                return callback(err);
            }

            callback(null, result.affectedRows);
        }
    );
};

// Delete Note
noteService.deleteNote = (id, callback) => {

    db.query(
        'DELETE FROM notes WHERE id = ?',
        [id],
        (err, result) => {

            if (err) {
                return callback(err);
            }

            callback(null, result.affectedRows);
        }
    );
};

module.exports = noteService;