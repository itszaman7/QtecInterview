const sequelize = require('../config/database');

async function fixTable() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database.');

    const [results] = await sequelize.query('SHOW COLUMNS FROM applications');
    const columns = results.map(c => c.Field || c.column_name);

    if (!columns.includes('interview_date')) {
      console.log('Adding interview_date column...');
      await sequelize.query('ALTER TABLE applications ADD COLUMN interview_date DATETIME NULL');
    }

    if (!columns.includes('interview_link')) {
      console.log('Adding interview_link column...');
      await sequelize.query('ALTER TABLE applications ADD COLUMN interview_link VARCHAR(255) NULL');
    }

    if (!columns.includes('interview_notes')) {
      console.log('Adding interview_notes column...');
      await sequelize.query('ALTER TABLE applications ADD COLUMN interview_notes TEXT NULL');
    }

    console.log('✅ Applications table fixed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to fix table:', error);
    process.exit(1);
  }
}

fixTable();
