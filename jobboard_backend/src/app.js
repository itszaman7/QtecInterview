require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const sequelize = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// Routes
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const companyAuthRoutes = require('./routes/companyAuthRoutes');
const companyJobRoutes = require('./routes/companyJobRoutes');
const adminCompanyRoutes = require('./routes/adminCompanyRoutes');

// Load models (ensures associations are registered)
require('./models/User');
require('./models/Job');
require('./models/Application');
require('./models/Admin');
require('./models/Company');

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/company', companyAuthRoutes);
app.use('/api/company/jobs', companyJobRoutes);
app.use('/api/admin/companies', adminCompanyRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'QuickHire API is running' });
});

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to TiDB Cloud.');

    // Plain sync: creates tables if they don't exist (TiDB doesn't support ALTER well)
    await sequelize.sync();
    console.log('✅ Database synchronized.');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
