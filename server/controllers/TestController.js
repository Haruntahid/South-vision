const Test = require("../models/Test");
const { Op } = require("sequelize");

const createTest = async (req, res) => {
  try {
    const { name, price } = req.body;
    const test = await Test.create({ name, price });
    res.status(201).json(test);
  } catch (error) {
    console.error("Error creating test:", error);
    res.status(500).json({ error: "Failed to create test" });
  }
};

const updateTest = async (req, res) => {
  try {
    const { name, price } = req.body;
    const { id } = req.params;

    const [updatedRows] = await Test.update({ name, price }, { where: { id } });

    if (updatedRows === 0) {
      return res.status(404).json({ error: "Test not found" });
    }

    res.json({ message: "Test updated successfully" });
  } catch (error) {
    console.error("Error updating test:", error);
    res.status(500).json({ error: "Failed to update test" });
  }
};

const deleteTest = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedRows = await Test.destroy({ where: { id } });

    if (deletedRows === 0) {
      return res.status(404).json({ error: "Test not found" });
    }

    res.json({ message: "Test deleted successfully" });
  } catch (error) {
    console.error("Error deleting test:", error);
    res.status(500).json({ error: "Failed to delete test" });
  }
};

const getTests = async (_req, res) => {
  try {
    const tests = await Test.findAll();
    res.json(tests);
  } catch (error) {
    console.error("Error fetching tests:", error);
    res.status(500).json({ error: "Failed to fetch tests" });
  }
};

const searchTest = async (req, res) => {
  try {
    const { name } = req.query;

    const whereClause = name
      ? {
          name: {
            [Op.like]: `%${name}%`,
          },
        }
      : {};

    const tests = await Test.findAll({ where: whereClause });
    res.json(tests);
  } catch (error) {
    console.error("Error fetching tests:", error);
    res.status(500).json({ error: "Failed to fetch tests" });
  }
};

module.exports = {
  createTest,
  updateTest,
  getTests,
  deleteTest,
  searchTest,
};
