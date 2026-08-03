import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const useMysql =
  process.env.DB_DIALECT === 'mysql' && process.env.DB_HOST && process.env.DB_NAME;

const sequelize = useMysql
  ? new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        logging: false,
        define: {
          underscored: true,
          timestamps: true,
          createdAt: 'created_at',
          updatedAt: 'updated_at',
        },
      }
    )
  : new Sequelize({
      dialect: 'sqlite',
      storage: process.env.DB_STORAGE || './database.sqlite',
      logging: false,
      define: {
        underscored: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
      },
    });

export { sequelize, DataTypes };
