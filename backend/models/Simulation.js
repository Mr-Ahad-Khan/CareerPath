import { DataTypes } from 'sequelize';
import { sequelize } from '../db/sequelize.js';
import User from './User.js';
import SkillProfile from './SkillProfile.js';

const Simulation = sequelize.define(
  'simulation',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false, field: 'user_id' },
    profileId: { type: DataTypes.INTEGER, allowNull: true, field: 'profile_id' },
    name: { type: DataTypes.STRING, allowNull: false, defaultValue: 'Untitled simulation' },
    whatIf: { type: DataTypes.JSON, allowNull: true },
    summary: { type: DataTypes.JSON, allowNull: true },
    isStarred: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, field: 'is_starred' },
  },
  { tableName: 'simulations' }
);

Simulation.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Simulation, { foreignKey: 'userId', as: 'simulations' });
Simulation.belongsTo(SkillProfile, { foreignKey: 'profileId', as: 'profile' });

const SimulationPath = sequelize.define(
  'simulation_path',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    simulationId: { type: DataTypes.INTEGER, allowNull: false, field: 'simulation_id' },
    code: { type: DataTypes.STRING, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    riskLevel: { type: DataTypes.INTEGER, allowNull: false, field: 'risk_level' },
    satisfactionScore: { type: DataTypes.FLOAT, allowNull: false, field: 'satisfaction_score' },
    confidenceScore: { type: DataTypes.FLOAT, allowNull: false, field: 'confidence_score' },
    trajectory: { type: DataTypes.JSON, allowNull: false },
    skillGaps: { type: DataTypes.JSON, allowNull: false, field: 'skill_gaps' },
    finalSalary: { type: DataTypes.FLOAT, allowNull: false, field: 'final_salary' },
    startSalary: { type: DataTypes.FLOAT, allowNull: false, field: 'start_salary' },
  },
  { tableName: 'simulation_paths' }
);

SimulationPath.belongsTo(Simulation, { foreignKey: 'simulationId', as: 'simulation' });
Simulation.hasMany(SimulationPath, { foreignKey: 'simulationId', as: 'paths' });

export { Simulation, SimulationPath };
export default Simulation;
