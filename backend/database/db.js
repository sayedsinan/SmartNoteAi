require('dotenv').config(); // Make sure your env variables are loaded
const db = require('mysql2');

const connection = db.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT // <-- THIS IS CRITICAL FOR RAILWAY
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to Railway database successfully!');
});

module.exports = connection;