const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const ApiError = require("../utils/apiError");
const Admin = require("../models/userModel");


// @desc    Add Moderator
// @route   POST /admin
// @access  Private 'Admin only'
exports.addAdminMod = asyncHandler(async (req, res, next) => {
  // 1) hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  // 2) Create user
  const mod = await Admin.create({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
    role: req.body.role.toUpperCase(),
  });

  // 4) Delete password from response
  delete mod._doc.password;

  // 5) send response to client side
  res.status(201).json({ data: mod });
});

// @desc    Get specific Moderator or Admin
// @route   GET /admin
// @access  Private 'Admin only'
exports.getAll = asyncHandler(async (req, res, next) => {
  // Build and Execute query
  const adminsCount = await Admin.countDocuments({ role: "ADMIN" });
  const moderatorsCount = await Admin.countDocuments({ role: "MODERATOR" });
  const moderators = await Admin.find({ role: "MODERATOR" });

  // Delete password from response
  moderators.forEach((moderators) => {
    delete moderators._doc.password;
  });

  res.status(200).json({
    result: { admins: adminsCount, moderators: moderatorsCount },
    data: { moderators: moderators },
  });
});

// @desc    Get specific Moderator or Admin
// @route   GET /admin/:id
// @access  Private 'Admin only'
exports.getByIdAdminMod = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  // Build and Execute query
  const admin = await Admin.findOne({ _id: id });

  if (!admin) {
    return next(new ApiError(`No admin or moderator for this id : ${id}`, 404));
  }

  // Delete password from response
  delete admin._doc.password;

  res.status(200).json({ data: admin });
});

// @desc    Update specific Moderator or Admin
// @route   PUT /admin/:id
// @access  Private 'Admin only'
exports.updateAdminMod = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // 2) Create user
  const newData = {
    username: req.body.username,
    email: req.body.email,
    role: req.body.role.toUpperCase(),
  };
  // Build query
  const admin = await Admin.findOneAndUpdate({ _id: id }, newData, {
    new: true,
  });

  if (!admin) {
    return next(
      new ApiError(`No admin or moderator for this this id : ${id}`, 404)
    );
  }
  // Delete password from response
  delete admin._doc.password;
  res.status(200).json({ data: admin });
});

// @desc    Update password specific Moderator or Admin
// @route   PUT /admin/password/:id
// @access  Private 'Admin only'
exports.updateAdminModPwd = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // 1) hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const newData = {
    password: hashedPassword,
    passwordChangedAt: Date.now(),
  };

  // Build query
  const admin = await Admin.findOneAndUpdate({ _id: id }, newData, {
    new: true,
  });

  if (!admin) {
    return next(
      new ApiError(`No admin or moderator for this this id : ${id}`, 404)
    );
  }
  // Delete password from response
  delete admin._doc.password;

  res.status(200).json({ data: admin });
});

// @desc    Delete specific Moderator or Admin
// @route   POST /admin/:id
// @access  Private 'Admin only'
exports.deleteAdminMod = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // Build query
  const admin = await Admin.findOneAndDelete({ _id: id });

  if (!admin) {
    return next(
      new ApiError(`No admin or moderator for this this id : ${id}`, 404)
    );
  }

  res.status(204).send();
});