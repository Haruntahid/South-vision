const express = require("express");
const cors = require("cors");
const app = express();
const patientRoutes = require("./routes/PatientRoutes");
const testRoutes = require("./routes/TestRoutes");
const invoiceRoutes = require("./routes/InvoiceRoutes");

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use("/api", patientRoutes);
app.use("/api", testRoutes);
app.use("/api", invoiceRoutes);

module.exports = app;
