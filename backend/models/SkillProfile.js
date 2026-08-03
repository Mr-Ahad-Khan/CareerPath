import { DataTypes } from 'sequelize';
import { sequelize } from '../db/sequelize.js';
import User from './User.js';

const SkillProfile = sequelize.define(
  'skill_profile',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false, field: 'user_id' },
    educationLevel: { type: DataTypes.STRING, allowNull: false, field: 'education_level' },
    educationField: { type: DataTypes.STRING, allowNull: false, field: 'education_field' },
    graduationYear: { type: DataTypes.INTEGER, allowNull: true, field: 'graduation_year' },
    currentRole: { type: DataTypes.STRING, allowNull: true, field: 'current_role' },
    experienceYears: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0, field: 'experience_years' },
    skills: { type: DataTypes.JSON, allowNull: false },
    interests: { type: DataTypes.JSON, allowNull: false },
    constraints: { type: DataTypes.JSON, allowNull: false },
    location: { type: DataTypes.STRING, allowNull: true },
    targetRole: { type: DataTypes.STRING, allowNull: true, field: 'target_role' },
    currency: { type: DataTypes.STRING, allowNull: false, defaultValue: 'INR' },
  },
  { tableName: 'skill_profiles' }
);

SkillProfile.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(SkillProfile, { foreignKey: 'userId', as: 'profiles' });

export default SkillProfile;
