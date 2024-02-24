const express = require("express");
const router = express.Router();
const {
  createGroupeValidator,
  getByIdGroupeValidator,
  updateGroupeValidator,
  deleteGroupeValidator,
} = require("../utils/validators/groupeValidator");
const { protect, allowedTo } = require("../middlewares/authMiddleware");
const {
  createGroupe,
  getAllGroupe,
  getByIdGroupe,
  updateGroupe,
  deleteGroupe,
} = require("../controllers/groupeController");

// only login admin is allowed
router.post("/", protect, allowedTo("ADMIN"), createGroupeValidator, createGroupe);
router.get("/", protect, getAllGroupe);
router.get("/:id", protect, allowedTo("ADMIN"), getByIdGroupeValidator, getByIdGroupe);
router.put("/:id", protect, allowedTo("ADMIN"), updateGroupeValidator, updateGroupe);
router.delete("/:id", protect, allowedTo("ADMIN"), deleteGroupeValidator, deleteGroupe);

module.exports = router;
