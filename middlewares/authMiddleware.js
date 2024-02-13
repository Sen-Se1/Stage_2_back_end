const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const Admin = require("../models/userModel");

// @desc   make sure the user is logged in
exports.protect = asyncHandler(async (req, res, next) => {
  // 1) Check if token exist, if exist get
  let token;
  if (req.headers.authorization || req.headers.Authorization) {
    token = req.headers.authorization;
  }
  if (!token) {
    return next(
      new ApiError(
        "You are not login, Please login to get access this route",
        401
      )
    );
  }
  // 2) Verify token (no change happens, expired token)
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  // 3) Check if user exists
  const currentUser = await Admin.findById(decoded.userId);
  if (!currentUser) {
    return next(
      new ApiError(
        "The user that belong to this token does no longer exist",
        401
      )
    );
  }
  // 4) Check if user change his password after token created
  if (currentUser.passwordChangedAt) {
    const passChangedTimestamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );
    // Password changed after token created (Error)
    if (passChangedTimestamp > decoded.iat) {
      return next(
        new ApiError(
          'User recently changed his password. please login again..',
          401
        )
      );
    }
  }
  delete currentUser._doc.password;
  req.user = currentUser;
  next();
});

// @desc  Middleware function to check if the user is the owner of the profile
exports.isProfileOwner = asyncHandler((req, res, next) => {
  // Assuming you have a user ID property on the request object
  const userId = req.user.id;

  // Assuming you have a profile ID property on the request object
  const profileId = req.params.id;

  // Check if the user ID matches the profile ID
  if (userId === profileId) {
    // User is the owner, allow access to the route
    next();
  } else {
    // User is not the owner, return an error response
    return next(
      new ApiError(
        "You are not authorized to view and edit a profile that you do not own",
        403
      )
    );
  }
});

// @desc    Authorization (User Permissions)
// ["admin"]
exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    // 1) access roles
    // 2) access registered user (req.user.role)
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("You are not allowed to access this route", 403)
      );
    }
    next();
  });

// @desc   ckeck if admin has been get, updated, or deleted by id and block yourself from accessing your information
exports.checkCurrentlyAdmin = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const adminCurrently = await Admin.findOne({ _id: id });

  if (!adminCurrently) {
    return next(
      new ApiError(`No moderator for this this id : ${id}`, 404)
    );
  }
  if (adminCurrently._id.toString() == req.user._id.toString()) {
    return next(
      new ApiError(
        "You are not allowed to get, updated, or deleted your profile and password in this route",
        403
      )
    );
  }
  if (adminCurrently.role === "ADMIN") {
    return next(
      new ApiError(
        "You are not allowed to get, updated, or deleted any admin in this route",
        403
      )
    );
  }
  next();
});
