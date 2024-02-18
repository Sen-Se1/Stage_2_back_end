const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
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

// @desc    Forgot password
// @route   POST /user/forgotPassword
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user by email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(`There is no user with that email: ${req.body.email}`, 404)
    );
  }
  // 2) If user exist, Generate hash token and save it in db
  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  // Save hashed password reset token into db
  user.passwordResetToken = hashedResetToken;
  // Add expiration time for password reset Token (5 min)
  user.passwordResetTokenExpires = Date.now() + 5 * 60 * 1000;

  await user.save();

  // 3) Send the reset code via email
  // const resetUrl = `${req.protocol}://${req.get('host')}/user/resetPassword/${resetToken}`;
    const resetUrl = `${req.protocol}://localhost:4200/reset-password/${resetToken}`;
  const message = `<h4>Hi ${user.username}</h4>We received a request to reset the password on your Admin Dashboard Account. 
                  Please use the below link to reset your password <br><a href='${resetUrl}'>Your link</a><br>
                  This reset password link will be valid only for 5 minutes. <br> Thanks for helping us keep your account secure.`;
  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset code (valid for 5 min)',
      message,
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;

    await user.save();
    return next(new ApiError('There is an error in sending email', 500));
  }

  res.status(200).json({ message: 'Password reset link send to your email' });
});

// @desc    Reset password
// @route   POST /user/resetPassword/:token
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user based on reset token
  const hashedResetToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedResetToken,
    passwordResetTokenExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ApiError('Token is invalid or has expired', 400));
  }
  // 2) hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  user.password = hashedPassword;
  user.passwordChangedAt = Date.now(); 
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;

  await user.save();

  res.status(200).json({ message: 'Your password has been reset successfully' });
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
