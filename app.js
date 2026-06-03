const express= require('express');
const cors = require('cors');
const app = express();
app.use(cors());
const port= 3000;

app.use(express.json());

require('./database/db');

// Routes
const noteRoutes = require('./route/notesRouter');
app.use('/api', noteRoutes);

// Health Check
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Server Running'
    });
});


app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});