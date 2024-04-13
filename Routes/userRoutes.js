const express = require("express");
const Router = express.Router();
const authController = require("./../controllers/authController");
const userController = require("./../controllers/userController");

Router.route("/getAllUsers").get(userController.getAllUsers);

Router.route("/updatePassword").patch(
  authController.protect,
  userController.updatePassword
);

Router.route("/updateMe").patch(
  authController.protect,
  userController.updateMe
);

Router.route("/deleteMe").delete(
  authController.protect,
  userController.deleteMe
);

module.exports = Router;
