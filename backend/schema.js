const db = require('./database/db');
db.query('DESCRIBE notes', (err, results) => {
    console.log(results);
    process.exit(0);
});
