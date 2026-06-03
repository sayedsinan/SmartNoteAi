const express= require('express');
const cors = require('cors');
const app = express();
app.use(cors());
const port= 10774;

app.use(express.json());

require('./database/db');

app.use('/api', require('./route/notesRouter'));

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});