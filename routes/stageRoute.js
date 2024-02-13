const express = require("express");
const router = express.Router();
const {
  createStageValidator,
  getByIdStageValidator,
  updateStageValidator,
  deleteStageValidator,
} = require("../utils/validators/stageValidator");
const { protect } = require("../middlewares/authMiddleware");
const {
  createStage,
  getAllStage,
  getByIdStage,
  updateStage,
  deleteStage,
} = require("../controllers/stageController");

// only login admin is allowed
router.post("/", protect, createStageValidator, createStage);
router.get("/", protect, getAllStage);
router.get("/:id", protect, getByIdStageValidator, getByIdStage);
router.put("/:id", protect, updateStageValidator, updateStage);
router.delete("/:id", protect, deleteStageValidator, deleteStage);

module.exports = router;
