const { Sequelize } = require('sequelize');
const fs = require('fs');
require('dotenv').config();

const caPath = process.env.DB_CA_PATH;
const dialectOptions = {};

// Handle CA path for secure TiDB connection
if (caPath && fs.existsSync(caPath)) {
  dialectOptions.ssl = {
    ca: fs.readFileSync(caPath),
    rejectUnauthorized: true,
  };
} else {
  // TiDB Cloud often requires SSL
  dialectOptions.ssl = {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: true
  };
}

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    dialectOptions,
    logging: false, // Set to process.stdout.write to see SQL logs
  }
);

module.exports = sequelize;
