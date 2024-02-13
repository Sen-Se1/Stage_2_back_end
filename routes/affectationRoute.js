const express = require("express");
const router = express.Router();
const {
  createAffectationValidator,
  getByIdAffectationValidator,
  updateAffectationValidator,
  deleteAffectationValidator,
} = require("../utils/validators/affectationValidator");
const { protect } = require("../middlewares/authMiddleware");
const {
  createAffectation,
  getAllAffectation,
  getByIdAffectation,
  updateAffectation,
  deleteAffectation,
} = require("../controllers/affectationController");

// only login admin is allowed
router.post("/", protect, createAffectationValidator, createAffectation);
router.get("/", protect, getAllAffectation);
router.get(
  "/:id",
  protect,
  getByIdAffectationValidator,
  getByIdAffectation
);
router.put(
  "/:id",
  protect,
  updateAffectationValidator,
  updateAffectation
);
router.delete(
  "/:id",
  protect,
  deleteAffectationValidator,
  deleteAffectation
);

module.exports = router;
