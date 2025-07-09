const sequelize = require("./config/db");

const Patient = require("./models/Patient");
const Test = require("./models/Test");
const Invoice = require("./models/Invoice");
const TestResult = require("./models/TestResult");

// Associations
Patient.hasMany(Invoice, { foreignKey: "patientId" });
Invoice.belongsTo(Patient, { foreignKey: "patientId" });

Invoice.hasMany(TestResult, { foreignKey: "invoiceId" });
TestResult.belongsTo(Invoice, { foreignKey: "invoiceId" });

Test.hasMany(TestResult, { foreignKey: "testId" });
TestResult.belongsTo(Test, { foreignKey: "testId" });

module.exports = {
  sequelize,
  Patient,
  Test,
  Invoice,
  TestResult,
};
