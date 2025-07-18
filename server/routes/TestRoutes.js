const express = require("express");
const router = express.Router();
const {
  createTest,
  updateTest,
  getTests,
  deleteTest,
  searchTest,
} = require("../controllers/TestController");

router.post("/v1/create-test", createTest);
router.get("/v1/get-all-test", getTests);
router.patch("/v1/update-test/:id", updateTest);
router.delete("/v1/delete-test/:id", deleteTest);
router.get("/v1/search/:name", searchTest);

module.exports = router;
