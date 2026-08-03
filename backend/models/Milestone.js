import { DataTypes } from 'sequelize';
import { sequelize } from '../db/sequelize.js';
import User from './User.js';
import { SimulationPath } from './Simulation.js';

const Milestone = sequelize.define(
  'milestone',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false, field: 'user_id' },
    pathId: { type: DataTypes.INTEGER, allowNull: true, field: 'path_id' },
    quarter: { type: DataTypes.STRING, allowNull: false },
    year: { type: DataTypes.INTEGER, allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    status: {
      type: DataTypes.ENUM('todo', 'in_progress', 'complete'),
      allowNull: false,
      defaultValue: 'todo',
    },
    orderIndex: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, field: 'order_index' },
  },
  { tableName: 'milestones' }
);

Milestone.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Milestone, { foreignKey: 'userId', as: 'milestones' });
Milestone.belongsTo(SimulationPath, { foreignKey: 'pathId', as: 'path' });

export default Milestone;
