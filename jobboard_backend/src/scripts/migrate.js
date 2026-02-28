require('dotenv').config();
const sequelize = require('../config/database');
const Company = require('../models/Company');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Admin = require('../models/Admin');

async function syncAndSeed() {
  try {
    await sequelize.authenticate();
    console.log('Connected to DB');

    // Force sync drops all tables and recreates them
    await sequelize.sync({ force: true });
    console.log('Database schema recreated successfully.');

    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

syncAndSeed();
