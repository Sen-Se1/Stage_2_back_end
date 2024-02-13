const express = require("express");
const router = express.Router();
const {
  addAdminModValidator,
  getByIdAdminModValidator,
  updateAdminModValidator,
  updateAdminModPwdValidator,
  deleteAdminModValidator,
} = require("../utils/validators/adminValidator");
const {
  protect,
  allowedTo,
  checkCurrentlyAdmin,
} = require("../middlewares/authMiddleware");
const {
  addAdminMod,
  getAll,
  getByIdAdminMod,
  updateAdminMod,
  updateAdminModPwd,
  deleteAdminMod,
} = require("../controllers/adminController");

// only login admin is allowed
router.post("/", protect, allowedTo("ADMIN"), addAdminModValidator, addAdminMod);
router.get("/", protect, allowedTo("ADMIN"), getAll);

// admin can't get, update or delete yourself in this case
router.get(
  "/:id",
  protect,
  allowedTo("ADMIN"),
  getByIdAdminModValidator,
  checkCurrentlyAdmin,
  getByIdAdminMod
);
router.put(
  "/:id",
  protect,
  allowedTo("ADMIN"),
  updateAdminModValidator,
  checkCurrentlyAdmin,
  updateAdminMod
);
router.put(
  "/password/:id",
  protect,
  allowedTo("ADMIN"),
  updateAdminModPwdValidator,
  checkCurrentlyAdmin,
  updateAdminModPwd
);
router.delete(
  "/:id",
  protect,
  allowedTo("ADMIN"),
  deleteAdminModValidator,
  checkCurrentlyAdmin,
  deleteAdminMod
);

module.exports = router;
