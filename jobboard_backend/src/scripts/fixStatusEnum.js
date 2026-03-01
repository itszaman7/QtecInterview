const sequelize = require('../config/database');

async function fixStatusEnum() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database.');

    console.log('Updating Application status ENUM to include "interviewing"...');
    // For MySQL, we use MODIFY COLUMN. For other DBs this might differ.
    await sequelize.query("ALTER TABLE applications MODIFY COLUMN status ENUM('pending', 'approved', 'rejected', 'interviewing') DEFAULT 'pending'");

    console.log('✅ Applications status column updated successfully.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to update status column:', error);
    process.exit(1);
  }
}

fixStatusEnum();
