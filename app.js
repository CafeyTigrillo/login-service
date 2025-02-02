require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const loginRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(bodyParser.json());
app.use('/api', loginRoutes);

app.listen(PORT, async () => {
  console.log(`Server running at http://localhost:${PORT}`);
  try {
    await sequelize.authenticate();
    console.log('Database connection successful.');
  } catch (error) {
    console.error('Failed to connect to the database:', error);
  }
});
