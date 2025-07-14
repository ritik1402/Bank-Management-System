
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const BankDetails = sequelize.define('BankDetails', {
  accountNumber: {
    type: DataTypes.STRING(16),
    unique: true,
    allowNull: false,
  },
  balance: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  deleteRequested: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

export default BankDetails;
