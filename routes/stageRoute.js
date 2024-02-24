const express = require("express");
const router = express.Router();
const {
  createStageValidator,
  getByIdStageValidator,
  updateStageValidator,
  deleteStageValidator,
} = require("../utils/validators/stageValidator");
const { protect, allowedTo } = require("../middlewares/authMiddleware");
const {
  createStage,
  getAllStage,
  getByIdStage,
  updateStage,
  deleteStage,
} = require("../controllers/stageController");

// only login admin is allowed
router.post("/", protect, allowedTo("ADMIN"), createStageValidator, createStage);
router.get("/", protect, getAllStage);
router.get("/:id", protect, allowedTo("ADMIN"), getByIdStageValidator, getByIdStage);
router.put("/:id", protect, allowedTo("ADMIN"), updateStageValidator, updateStage);
router.delete("/:id", protect, allowedTo("ADMIN"), deleteStageValidator, deleteStage);

module.exports = router;
