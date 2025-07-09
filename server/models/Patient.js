const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Patient = sequelize.define("Patient", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "Name is required" },
      len: { args: [2, 100], msg: "Name must be 2 to 100 characters long" },
    },
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: { msg: "Phone number is required" },
      is: {
        args: /^01[0-9]{9}$/,
        msg: "Phone number must be exactly 11 digits",
      },
    },
  },
  gender: {
    type: DataTypes.ENUM("male", "female"),
    allowNull: false,
    validate: {
      isIn: {
        args: [["male", "female"]],
        msg: "Gender must be either 'male' or 'female'",
      },
    },
  },
  age: {
    type: DataTypes.INTEGER,
    validate: {
      min: { args: [0], msg: "Age cannot be negative" },
      max: { args: [150], msg: "Age seems too high" },
      isInt: { msg: "Age must be an integer" },
    },
  },
  address: {
    type: DataTypes.TEXT,
    validate: {
      notEmpty: { msg: "Address cannot be empty" },
    },
  },
});

module.exports = Patient;
