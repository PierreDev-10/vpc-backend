const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const registrationRoutes = require('./routes/registration.routes'); // ✅ Unified and correct

dotenv.config();

const db = require('./models');
const app = express();
const PORT = process.env.PORT || 5001;

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ API Base Route
app.use('/api/register', registrationRoutes);
app.use((req, res, next) => {
  console.log(`📡 Incoming Request: ${req.method} ${req.originalUrl}`);
  next();
});

// ✅ Health Check Route
app.get('/', (req, res) => {
  res.send('VPC Registration API is running 🚀');
});

// ✅ Start Server
app.listen(PORT, async () => {
  console.log(`Server is running on ${PORT}`);

  try {
    await db.sequelize.authenticate();
    console.log('✅ Database connected successfully.');
    await db.sequelize.sync({ alter: true });
    console.log('📦 Tables synced with database (alter:true)');
  } catch (err) {
    console.error('❌ Unable to connect to the database:', err);
  }
});