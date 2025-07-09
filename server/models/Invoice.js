const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Invoice = sequelize.define("Invoice", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  invoiceNumber: {
    type: DataTypes.STRING,
    unique: true,
  },
  patientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  discountType: {
    type: DataTypes.ENUM("amount", "percent"),
    allowNull: true,
  },
  discountValue: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  finalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = Invoice;
