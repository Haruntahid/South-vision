const { Invoice, TestResult, Test, Patient, sequelize } = require("../index");

const createInvoice = async (req, res) => {
  try {
    const { patientId, testIds, discountType, discountValue } = req.body;

    // Validate input
    if (!patientId || !Array.isArray(testIds) || testIds.length === 0) {
      return res.status(400).json({ error: "Invalid patient or test data" });
    }

    // Check if patient exists
    const patient = await Patient.findByPk(patientId);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    // Fetch tests and verify all exist
    const tests = await Test.findAll({ where: { id: testIds } });
    if (tests.length !== testIds.length) {
      const foundTestIds = tests.map((test) => test.id);
      const missingTestIds = testIds.filter((id) => !foundTestIds.includes(id));
      return res
        .status(404)
        .json({ error: `Test(s) not found: ${missingTestIds.join(", ")}` });
    }

    // Calculate total
    const totalAmount = tests.reduce(
      (sum, test) => sum + parseFloat(test.price),
      0
    );

    // Apply discount
    let discount = 0;
    if (discountType === "percent") {
      discount = (parseFloat(discountValue) / 100) * totalAmount;
    } else if (discountType === "amount") {
      discount = parseFloat(discountValue);
    }

    const finalAmount = totalAmount - discount;
    const invoiceNumber = `INV-${Date.now()}`;

    // Create invoice
    const invoice = await Invoice.create({
      invoiceNumber,
      patientId,
      totalAmount,
      discountType,
      discountValue,
      finalAmount,
    });

    // Create test results
    for (const test of tests) {
      await TestResult.create({
        invoiceId: invoice.id,
        testId: test.id,
      });
    }

    res.status(201).json({ message: "Invoice created successfully", invoice });
  } catch (error) {
    console.error("Error in createInvoice:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getInvoiceReport = async (req, res) => {
  try {
    const [data] = await sequelize.query(`
      SELECT 
        DATE(createdAt) AS date,
        COUNT(*) AS invoiceCount,
        SUM(totalAmount) AS totalAmount,
        SUM(finalAmount) AS collectedAmount
      FROM Invoices
      GROUP BY DATE(createdAt)
      ORDER BY DATE(createdAt) DESC
    `);

    res.json(data);
  } catch (error) {
    console.error("Error in getInvoiceReport:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { createInvoice, getInvoiceReport };
