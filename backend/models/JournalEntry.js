import { DataTypes } from 'sequelize';
import { sequelize } from '../db/sequelize.js';
import User from './User.js';

const JournalEntry = sequelize.define(
  'journal_entry',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false, field: 'user_id' },
    date: { type: DataTypes.DATEONLY, allowNull: false, defaultValue: DataTypes.NOW },
    activity: { type: DataTypes.STRING, allowNull: false },
    skill: { type: DataTypes.STRING, allowNull: true },
    durationMinutes: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 30, field: 'duration_minutes' },
    note: { type: DataTypes.TEXT, allowNull: true },
  },
  { tableName: 'journal_entries' }
);

JournalEntry.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(JournalEntry, { foreignKey: 'userId', as: 'journal' });

export default JournalEntry;
