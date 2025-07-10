const express = require("express");
const router = express.Router();
const {
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient,
} = require("../controllers/PatientController");

router.post("/v1/patient", createPatient); // Create
router.get("/v1/patient", getAllPatients); // Get all or search
router.get("/v1/patient/:id", getPatientById); // Get by ID
router.patch("/v1/patient/:id", updatePatient); // Update
router.delete("/v1/patient/:id", deletePatient);

module.exports = router;
