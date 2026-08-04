import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const database = process.env.DB_NAME || 'CareerPath';
const username = process.env.DB_USER || 'root';

const sequelize = new Sequelize(database, username, process.env.DB_PASSWORD || '', {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  dialect: 'mysql',
  logging: false,
  define: {
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

export { sequelize, DataTypes };
