const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const createToken = require("../utils/createToken");
const ApiError = require("../utils/apiError");
const User = require("../models/userModel");

// @desc    Register
// @route   Post /user/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  // 1) hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  // 2) Create user
  const user = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
    role: req.body.role.toUpperCase(),
  });

  // 3) Generate token
  const token = createToken(user._id);

  // 4) Delete password from response
  delete user._doc.password;

  // 5) send response to client side
  res.status(201).json({ data: user, token });
});

// @desc    Login route
// @route   POST /user/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  // 1) check if password and email in the body (validation)
  // 2) check if user exist & check if password is correct
  const user = await User.findOne({ email: req.body.email });

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError("Incorrect email or password", 401));
  }
  // 3) generate token
  const token = createToken(user._id);

  // 4) Delete password from response
  delete user._doc.password;

  // 5) send response to client side
  res.status(200).json({ data: user, token });
});

// @desc    Get specific profile
// @route   GET /user/:id
// @access  Private
exports.getProfile = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // Build and Execute query
  const profile = await User.findOne({ _id: id });
  if (!profile) {
    return next(new ApiError(`No profile for this id : ${id}`, 404));
  }
  // 4) Delete password from response
  delete profile._doc.password;
  res.status(200).json({ data: profile });
});

// @desc    Update specific profile
// @route   PUT /user/:id
// @access  Private
exports.updateProfile = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // 2) Create user
  const newData = {
    username: req.body.username,
    email: req.body.email,
  };
  // Build query
  const user = await User.findOneAndUpdate({ _id: id }, newData, {
    new: true,
  });

  if (!user) {
    return next(new ApiError(`No profile for this this id : ${id}`, 404));
  }
  // Delete password from response
  delete user._doc.password;
  res.status(200).json({ data: user });
});

// @desc    Update logged user password
// @route   PUT /user/password/:id
// @access  Private
exports.updateProfilePwd = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // 1) hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const newData = {
    password: hashedPassword,
    passwordChangedAt: Date.now(),
  };

  // Build query
  const user = await User.findOneAndUpdate({ _id: id }, newData, {
    new: true,
  });

  if (!user) {
    return next(new ApiError(`No profile for this this id : ${id}`, 404));
  }

  // 2) Generate token
  const token = createToken(user._id);

  // Delete password from response
  delete user._doc.password;

  res.status(200).json({ data: user, token });
});
