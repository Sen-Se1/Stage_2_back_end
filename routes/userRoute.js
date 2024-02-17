const express = require("express");
const router = express.Router();
const {
  loginValidator,
  registerValidator,
  getProfileValidator,
  updateProfileValidator,
  updateProfilePwdValidator,
} = require("../utils/validators/userValidator");
const { protect, isProfileOwner } = require("../middlewares/authMiddleware");
const {
  login,
  register,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
  updateProfilePwd,
} = require("../controllers/userController");

router.post("/login", loginValidator, login);
router.post("/register", registerValidator, register);
router.post('/forgotPassword', forgotPassword);
// router.put('/resetPassword', resetPassword);

// only login user is allowed
router.get(
  "/:id",
  protect,
  getProfileValidator,
  isProfileOwner,
  getProfile
);
router.put(
  "/:id",
  protect,
  isProfileOwner,
  updateProfileValidator,
  updateProfile
);
router.put(
  "/password/:id",
  protect,
  isProfileOwner,
  updateProfilePwdValidator,
  updateProfilePwd
);

module.exports = router;
