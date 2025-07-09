const express = require("express");
const router = express.Router();
const {
  createInvoice,
  getInvoiceReport,
} = require("../controllers/InvoiceController");

router.post("/v1/invoice", createInvoice);
router.get("/v1/invoice-report", getInvoiceReport);

module.exports = router;
