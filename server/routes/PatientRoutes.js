const express = require("express");
const router = express.Router();
const { createOrFetchPatient } = require("../controllers/PatientController");

router.post("/v1/patient", createOrFetchPatient);

module.exports = router;
