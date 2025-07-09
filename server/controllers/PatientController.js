const Patient = require("../models/Patient");

const createOrFetchPatient = async (req, res) => {
  try {
    const { phone, name, gender, age, address } = req.body;

    // If phone not exist then return 400
    if (!phone) {
      return res.status(400).json({ error: "Phone number is required" });
    }

    // Find Patient
    let patient = await Patient.findOne({ where: { phone } });
    if (patient) {
      return res.status(200).json(patient);
    }

    // New Patient
    patient = await Patient.create({ phone, name, gender, age, address });
    return res.status(201).json(patient);
  } catch (error) {
    // Sequelize validation error handle
    if (error.name === "SequelizeValidationError") {
      const messages = error.errors.map((e) => e.message);
      return res.status(400).json({ errors: messages });
    }

    console.error("Error in createOrFetchPatient:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { createOrFetchPatient };
