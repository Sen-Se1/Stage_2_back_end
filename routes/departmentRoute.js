const express = require("express");
const router = express.Router();
const {
  createDepartmentValidator,
  getByIdDepartmentValidator,
  updateDepartmentValidator,
  deleteDepartmentValidator,
} = require("../utils/validators/departmentValidator");
const { protect } = require("../middlewares/authMiddleware");
const {
  createDepartment,
  getAllDepartment,
  getByIdDepartment,
  updateDepartment,
  deleteDepartment,
} = require("../controllers/departmentController");

// only login admin is allowed
router.post("/", protect, createDepartmentValidator, createDepartment);
router.get("/", protect, getAllDepartment);
router.get(
  "/:id",
  protect,
  getByIdDepartmentValidator,
  getByIdDepartment
);
router.put("/:id", protect, updateDepartmentValidator, updateDepartment);
router.delete(
  "/:id",
  protect,
  deleteDepartmentValidator,
  deleteDepartment
);

module.exports = router;
