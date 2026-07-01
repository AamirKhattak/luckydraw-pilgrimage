const express = require("express");
const verifySecret = require("../middleware/verifySecret");
const drawController = require("../controllers/drawController");

const router = express.Router();

router.post("/draw", verifySecret, drawController.runDraw);
router.get("/draws", drawController.getAllDraws);
router.get("/draw/:id/results", drawController.getDrawResults);

module.exports = router;
