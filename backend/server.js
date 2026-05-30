const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./src/config/db');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const materialsRouter = require('./src/routes/materials');
const sitesRouter = require('./src/routes/sites');
const vendorsRouter = require('./src/routes/vendors');
const transactionsRouter = require('./src/routes/transactions');

app.use('/api/materials', materialsRouter);
app.use('/api/sites', sitesRouter);
app.use('/api/vendors', vendorsRouter);
app.use('/api/transactions', transactionsRouter);

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'BuildTrack API is running!',
    version: '1.0.0'
  });
});

// Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`BuildTrack server running on port ${PORT}`);
});