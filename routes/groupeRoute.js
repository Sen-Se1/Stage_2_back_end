const express = require("express");
const router = express.Router();
const {
  createGroupeValidator,
  getByIdGroupeValidator,
  updateGroupeValidator,
  deleteGroupeValidator,
} = require("../utils/validators/groupeValidator");
const { protect } = require("../middlewares/authMiddleware");
const {
  createGroupe,
  getAllGroupe,
  getByIdGroupe,
  updateGroupe,
  deleteGroupe,
} = require("../controllers/groupeController");

// only login admin is allowed
router.post("/", protect, createGroupeValidator, createGroupe);
router.get("/", protect, getAllGroupe);
router.get("/:id", protect, getByIdGroupeValidator, getByIdGroupe);
router.put("/:id", protect, updateGroupeValidator, updateGroupe);
router.delete("/:id", protect, deleteGroupeValidator, deleteGroupe);

module.exports = router;
