import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Role = sequelize.define("Role", {
  role_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
}, {
  tableName: "Roles",
  timestamps: true,
});

export default Role;
