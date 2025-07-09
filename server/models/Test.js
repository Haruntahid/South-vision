const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Test = sequelize.define("Test", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Name must not be empty",
      },
      len: {
        args: [2, 100],
        msg: "Name must be between 2 and 100 characters",
      },
    },
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      isDecimal: {
        msg: "Price must be a decimal number",
      },
      min: {
        args: [0],
        msg: "Price must be a positive value",
      },
    },
  },
});

module.exports = Test;
