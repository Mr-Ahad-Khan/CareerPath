import { DataTypes } from 'sequelize';
import { sequelize } from '../db/sequelize.js';
import bcrypt from 'bcryptjs';

const User = sequelize.define(
  'user',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
    passwordHash: { type: DataTypes.STRING, allowNull: false },
    role: {
      type: DataTypes.ENUM('student', 'mentor', 'admin'),
      allowNull: false,
      defaultValue: 'student',
    },
    headline: { type: DataTypes.STRING, allowNull: true },
    avatarColor: { type: DataTypes.STRING, allowNull: false, defaultValue: '#ffb340' },
  },
  {
    tableName: 'users',
    defaultScope: {
      attributes: { exclude: ['passwordHash'] },
    },
    scopes: {
      withPassword: { attributes: { include: ['passwordHash'] } },
    },
  }
);

User.prototype.verifyPassword = function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

User.beforeCreate(async (user) => {
  if (user.passwordHash && !user.passwordHash.startsWith('$2')) {
    user.passwordHash = await bcrypt.hash(user.passwordHash, 10);
  }
});
User.beforeUpdate(async (user) => {
  if (user.changed('passwordHash') && !user.passwordHash.startsWith('$2')) {
    user.passwordHash = await bcrypt.hash(user.passwordHash, 10);
  }
});

export default User;
