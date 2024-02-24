const express = require("express");
const router = express.Router();
const {
  createDepartmentValidator,
  getByIdDepartmentValidator,
  updateDepartmentValidator,
  deleteDepartmentValidator,
} = require("../utils/validators/departmentValidator");
const { protect, allowedTo } = require("../middlewares/authMiddleware");
const {
  createDepartment,
  getAllDepartment,
  getByIdDepartment,
  updateDepartment,
  deleteDepartment,
} = require("../controllers/departmentController");

// only login admin is allowed
router.post("/", protect, allowedTo("ADMIN"), createDepartmentValidator, createDepartment);
router.get("/", protect, getAllDepartment);
router.get(
  "/:id",
  protect,
  allowedTo("ADMIN"),
  getByIdDepartmentValidator,
  getByIdDepartment
);
router.put("/:id", protect, allowedTo("ADMIN"), updateDepartmentValidator, updateDepartment);
router.delete(
  "/:id",
  protect,
  allowedTo("ADMIN"),
  deleteDepartmentValidator,
  deleteDepartment
);

module.exports = router;
