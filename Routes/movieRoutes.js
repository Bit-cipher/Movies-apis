const express = require("express");
const moviesControllers = require("./../controllers/moviesControllers");
const authController = require("./../controllers/authController");

const Router = express.Router();

// Router.param('id', moviesControllers.checkId);

Router.route("/highest-rated").get(
  moviesControllers.getHighestRated,
  moviesControllers.getAllMovies
);

Router.route("/movie-stats").get(moviesControllers.getMovieStats);

Router.route("/")
  .get(authController.protect, moviesControllers.getAllMovies)
  .post(moviesControllers.createMovie);

Router.route("/:id")
  .get(authController.protect, moviesControllers.getMovie)
  .patch(moviesControllers.updateMovie)
  .delete(
    authController.protect,
    authController.restrict("admin"),
    moviesControllers.deleteMovie
  );

module.exports = Router;
