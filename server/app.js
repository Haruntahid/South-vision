const express = require("express");
const cors = require("cors");
const app = express();
const patientRoutes = require("./routes/PatientRoutes");
const testRoutes = require("./routes/TestRoutes");
const invoiceRoutes = require("./routes/InvoiceRoutes");
const authRoutes = require("./routes/AuthRoutes");

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use("/api", patientRoutes);
app.use("/api", testRoutes);
app.use("/api", invoiceRoutes);
app.use("/api", authRoutes);

module.exports = app;
