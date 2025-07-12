const { Op } = require("sequelize");
const Patient = require("../models/Patient");

// Create
const createPatient = async (req, res) => {
  try {
    const { phone, name, gender, age, address } = req.body;

    if (!phone)
      return res.status(400).json({ error: "Phone number is required" });

    const exists = await Patient.findOne({ where: { phone } });
    if (exists)
      return res.status(409).json({ error: "Patient already exists" });

    const patient = await Patient.create({ phone, name, gender, age, address });
    return res.status(201).json(patient);
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      const messages = error.errors.map((e) => e.message);
      return res.status(400).json({ errors: messages });
    }
    console.error("Error in createPatient:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all or search
const getAllPatients = async (req, res) => {
  try {
    const { phone, name } = req.query;
    const where = {};

    if (phone) where.phone = { [Op.like]: `%${phone}%` };
    if (name) where.name = { [Op.like]: `%${name}%` };

    const patients = await Patient.findAll({ where });
    res.status(200).json(patients);
  } catch (error) {
    console.error("Error in getAllPatients:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get single
const getPatientById = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findByPk(id);
    if (!patient) return res.status(404).json({ error: "Patient not found" });
    res.status(200).json(patient);
  } catch (error) {
    console.error("Error in getPatientById:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update
const updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const { phone, name, gender, age, address } = req.body;

    const patient = await Patient.findByPk(id);
    if (!patient) return res.status(404).json({ error: "Patient not found" });

    await patient.update({ phone, name, gender, age, address });
    res.status(200).json(patient);
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      const messages = error.errors.map((e) => e.message);
      return res.status(400).json({ errors: messages });
    }
    console.error("Error in updatePatient:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete
const deletePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findByPk(id);
    if (!patient) return res.status(404).json({ error: "Patient not found" });

    await patient.destroy();
    res.status(200).json({ message: "Patient deleted successfully" });
  } catch (error) {
    console.error("Error in deletePatient:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient,
};
