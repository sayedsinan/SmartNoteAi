const db = require('mysql2');

const conntection = db.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'smart_notes'
});

conntection.connect((err)=>{
    if(err){
        console.log('Error connecting to database', err);
        return;
    }
    console.log('Connected to database');
});

module.exports = conntection;