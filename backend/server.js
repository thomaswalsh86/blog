const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }));
app.use(express.json());  
app.use(express.urlencoded({ extended: true }));

const journeyRoute = require('./routes/journeyRoute');
const travelRoute = require('./routes/travelRoute');
const authRoute = require('./routes/authRoute');

app.use('/api/journey', journeyRoute);
app.use('/api/travel', travelRoute);
app.use('/api/auth', authRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
