const User = require("./../Models/userModel");
const asyncErrorHandler = require("./../Utils/asyncErrorHandler");
const jwt = require("jsonwebtoken");
const CustomError = require("./../Utils/CustomError");
const util = require("util");
const sendEmail = require("./../Utils/email");
const crypto = require("crypto");
const { errorMonitor } = require("events");
const authController = require("./authController");

exports.getAllUsers = asyncErrorHandler(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: "success",
    result: users.length,
    data: {
      users,
    },
  });
});

const filterReqObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((prop) => {
    if (allowedFields.includes(prop)) newObj[prop] = obj[prop];
  });
  return newObj;
};

exports.updatePassword = asyncErrorHandler(async (req, res, next) => {
  // GET CURRENT USER DATA FROM DATABASE
  const user = await User.findById(req.user._id).select("+password");

  //  CHECK IF THE SUPPLIED CURRENT PASSWORD IS CORRECT
  if (
    !(await user.comparePasswordInDb(req.body.currentPassword, user.password))
  ) {
    return next(
      new CustomError("The current password you provided is wrong", 401)
    );
  }

  // IF SUPPLIED PASSWORD IS CORRECT, UPDATE USER PASSWORD WITH NEW VALUE
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  await user.save();

  // LOGIN USER AND SEND JWT
  authController.createSendResponse(user, 200, res);
});

exports.updateMe = asyncErrorHandler(async (req, res, next) => {
  // 1. CHECK IF THE REQUEST DATA HAS PASSWORD AND CONFIRM PASSWORD
  if (req.body.password || req.body.confirmPassword) {
    return next(
      new CustomError(
        "You cannot update your password using this endpoint",
        400
      )
    );
  }

  // 2. UPDATE USER DETAIL
  const filterObj = filterReqObj(req.body, "name", "email");
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filterObj, {
    runValidators: true,
  });

  res.status(20).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = asyncErrorHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});
