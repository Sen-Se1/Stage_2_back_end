const express = require("express");
const router = express.Router();
const {
  createEtudiantValidator,
  getByIdEtudiantValidator,
  updateEtudiantValidator,
  deleteEtudiantValidator,
} = require("../utils/validators/etudiantValidator");
const { protect } = require("../middlewares/authMiddleware");
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
router.post("/", protect, createEtudiantValidator, createEtudiant);
router.post("/file", protect, upload, createByFileEtudiant);
router.get("/", protect, getAllEtudiant);
router.get("/:id", protect, getByIdEtudiantValidator, getByIdEtudiant);
router.put("/:id", protect, updateEtudiantValidator, updateEtudiant);
router.delete("/:id", protect, deleteEtudiantValidator, deleteEtudiant);















module.exports = router;
