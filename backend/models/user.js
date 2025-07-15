import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import Role from "./role.js";
import BankDetails from './bankDetail.js';

const User = sequelize.define(
  "User",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: DataTypes.STRING,
    age: DataTypes.STRING,
    contact: { type: DataTypes.STRING, unique: true },
    password: DataTypes.STRING,
    role_id: {
  type: DataTypes.INTEGER,
  allowNull: true, 
  references: { model: Role, key: "role_id" }
},

 bank_id: {
  type: DataTypes.INTEGER,
  references: {
    model: "BankDetails", 
    key: "bank_id",       
  },
}


  },
  {
    tableName: "Users",
    paranoid: true,
    timestamps: true,
  }
);

export default User;
