const express= require('express');
const app= express();
const port= 3000;

app.use(express.json());

require('./database/db');

app.use('/api', require('./route/notesRouter'));

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});