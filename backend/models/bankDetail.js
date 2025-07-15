
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const BankDetails = sequelize.define(
  "BankDetails",
  {
    bank_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      unique: true,
    },
    accountNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    balance: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    deleteRequested: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true,
    },
  },
  {
    tableName: "BankDetails",
    timestamps: true,
  }
);

export default BankDetails;
