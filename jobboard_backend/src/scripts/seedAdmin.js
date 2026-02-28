/**
 * Admin Seed Script
 * Creates the first admin user in the database.
 * 
 * Usage:
 *   node src/scripts/seedAdmin.js
 * 
 * Uses env vars ADMIN_EMAIL and ADMIN_PASSWORD, or defaults below.
 */
require('dotenv').config();
const sequelize = require('../config/database');
const Admin = require('../models/Admin');

const seedAdmin = async () => {
  const email = process.env.ADMIN_EMAIL || 'admin@quickhire.com';
  const password = process.env.ADMIN_PASSWORD || 'Admin@123';

  try {
    await sequelize.authenticate();
    console.log('Connected to database.');

    // Check if admin already exists
    const existing = await Admin.findOne({ where: { email } });
    if (existing) {
      console.log(`⚠️  Admin with email "${email}" already exists.`);
      process.exit(0);
    }

    const admin = await Admin.create({ email, password });
    console.log(`✅ Admin created successfully!`);
    console.log(`   Email: ${email}`);
    console.log(`   ID: ${admin.id}`);
    console.log(`\n   Use POST /api/auth/login with these credentials to get a session cookie.`);
  } catch (error) {
    console.error('❌ Failed to seed admin:', error.message);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
};

seedAdmin();
