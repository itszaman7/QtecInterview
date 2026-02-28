const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Job = sequelize.define('Job', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  company_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'FK to companies table — null for admin-created jobs',
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  company: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Company display name (denormalized for quick listing)',
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Full-Time',
  },
  is_featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Company can feature their job for advertisement',
  },
  tags: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of tag strings e.g. ["remote","urgent","senior"]',
  },
  deadline: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Application deadline — job expires after this date',
  },
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'jobs',
});

module.exports = Job;
