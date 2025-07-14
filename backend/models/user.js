
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import Role from './role.js';

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: DataTypes.STRING,
  age: DataTypes.STRING,
  contact: { type: DataTypes.STRING, unique: true },
  password: DataTypes.STRING
});



export default User;
