const express = require("express");
const router = express.Router();
const {
  createEtudiantValidator,
  getByIdEtudiantValidator,
  updateEtudiantValidator,
  deleteEtudiantValidator,
} = require("../utils/validators/etudiantValidator");
const { protect, allowedTo } = require("../middlewares/authMiddleware");
const { upload } = require('../middlewares/uploadFileMiddleware');
const {
  createEtudiant,
  createByFileEtudiant,
  getAllEtudiant,
  getByIdEtudiant,
  updateEtudiant,
  deleteEtudiant,
} = require("../controllers/etudiantController");

// only login admin is allowed
router.post("/", protect, allowedTo("ADMIN"), createEtudiantValidator, createEtudiant);
router.post("/file", protect, allowedTo("ADMIN"), upload, createByFileEtudiant);
router.get("/", protect, getAllEtudiant);
router.get("/:id", protect, allowedTo("ADMIN"), getByIdEtudiantValidator, getByIdEtudiant);
router.put("/:id", protect, allowedTo("ADMIN"), updateEtudiantValidator, updateEtudiant);
router.delete("/:id", protect, allowedTo("ADMIN"), deleteEtudiantValidator, deleteEtudiant);















module.exports = router;
