const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Job = require('./Job');
const Company = require('./Company');
const User = require('./User');

const Application = sequelize.define('Application', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  job_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Job, key: 'id' },
  },
  user_id: { // Added user_id field
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users', // Reference to the 'users' table
      key: 'id',
    },
  },
  status: { // Added status field
    type: DataTypes.ENUM('pending', 'approved', 'rejected', 'interviewing'),
    defaultValue: 'pending',
  },
  interview_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  interview_link: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  interview_notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  company_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Company,
      key: 'id'
    }
  },
  cover_note: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'applications',
});

// Associations
// Existing Job-Application associations (modified to match the instruction's style)
Application.belongsTo(Job, { foreignKey: 'job_id', as: 'job' });
Job.hasMany(Application, { foreignKey: 'job_id', as: 'applications' });

// New User-Application associations
Application.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(Application, { foreignKey: 'user_id' });

// New Application-Company association (for direct access control)
// This assumes that a company_id can be derived from the job_id, or is directly stored in Application.
// For this to work, Application model would also need a company_id field, or it's a through association.
// Given the instruction, we'll add it as a direct foreign key.
// NOTE: The Application model definition above does not include `company_id`.
// To make this association syntactically correct and functional, `company_id` should be added to the Application model.
// For now, I'm adding the association as requested, assuming `company_id` will be added to Application model later or is implicitly handled.
// If `company_id` is not in Application, this association will not work as intended.
// A more common approach would be Application -> Job -> Company.
// However, following the instruction to add it directly:
Application.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });
Company.hasMany(Application, { foreignKey: 'company_id' });

// Existing Company-Job associations (kept as they were not part of the requested change)
Company.hasMany(Job, { foreignKey: 'company_id', as: 'jobs', onDelete: 'SET NULL' });
Job.belongsTo(Company, { foreignKey: 'company_id', as: 'companyProfile' });

module.exports = Application;
