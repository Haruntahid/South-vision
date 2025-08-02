const express = require("express");
const router = express.Router();
const {
  createInvoice,
  getInvoiceReport,
  getAllInvoices,
} = require("../controllers/InvoiceController");

router.post("/v1/invoice", createInvoice);
router.get("/v1/invoice-report", getInvoiceReport);
router.get("/v1/invoices", getAllInvoices);

module.exports = router;
