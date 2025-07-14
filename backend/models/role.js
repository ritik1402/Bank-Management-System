import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Role = sequelize.define('Role', {
  role_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true, 
}
});

export default Role;
