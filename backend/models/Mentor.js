import { DataTypes } from 'sequelize';
import { sequelize } from '../db/sequelize.js';
import User from './User.js';

const Mentor = sequelize.define(
  'mentor',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: true, field: 'user_id' },
    name: { type: DataTypes.STRING, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    company: { type: DataTypes.STRING, allowNull: false },
    industry: { type: DataTypes.STRING, allowNull: false },
    specialty: { type: DataTypes.STRING, allowNull: false },
    experienceYears: { type: DataTypes.INTEGER, allowNull: false, field: 'experience_years' },
    location: { type: DataTypes.STRING, allowNull: false },
    bio: { type: DataTypes.TEXT, allowNull: false },
    expertise: { type: DataTypes.JSON, allowNull: false },
    languages: { type: DataTypes.JSON, allowNull: false },
    avatarColor: { type: DataTypes.STRING, allowNull: false, defaultValue: '#ffb340' },
    rating: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 4.7 },
    menteeCount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, field: 'mentee_count' },
  },
  { tableName: 'mentors' }
);

Mentor.belongsTo(User, { foreignKey: 'userId', as: 'user' });

const ConnectionRequest = sequelize.define(
  'connection_request',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    studentId: { type: DataTypes.INTEGER, allowNull: false, field: 'student_id' },
    mentorId: { type: DataTypes.INTEGER, allowNull: false, field: 'mentor_id' },
    message: { type: DataTypes.TEXT, allowNull: false },
    status: {
      type: DataTypes.ENUM('pending', 'accepted', 'declined'),
      allowNull: false,
      defaultValue: 'pending',
    },
  },
  { tableName: 'connection_requests' }
);

ConnectionRequest.belongsTo(User, { foreignKey: 'studentId', as: 'student' });
ConnectionRequest.belongsTo(Mentor, { foreignKey: 'mentorId', as: 'mentor' });
User.hasMany(ConnectionRequest, { foreignKey: 'studentId', as: 'sentRequests' });

export { Mentor, ConnectionRequest };
export default Mentor;
