const db = require('mysql2');

const conntection = db.createConnection({
    host: 'acela.proxy.rlwy.net',
    port: 10774,
    user: 'root',
    password: 'GlSYKtkoiCyAQpKxLNyzYNrpQuYuylge',
    database: 'railway'
});

conntection.connect((err)=>{
    if(err){
        console.log('Error connecting to database', err);
        return;
    }
    console.log('Connected to database');
});

module.exports = conntection;