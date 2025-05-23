// models/user.js

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('users', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    auth_method: {
      type: DataTypes.ENUM('phone', 'email'),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('member', 'leader', 'admin', 'super_admin'),
      allowNull: false,
      defaultValue: 'member',
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    timestamps: false,        // ⛔ Skip Sequelize's auto timestamps
  });
  return User;
};