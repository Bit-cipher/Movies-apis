const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const moviesRouter = require("./Routes/movieRoutes");
const authRouter = require("./Routes/authRouter");
const CustomError = require("./Utils/CustomError");
const globalErrorHandler = require("./controllers/ErrorController");
const userRoutes = require("./Routes/userRoutes");

let app = express();

app.use(helmet());

let limiter = rateLimit({
  max: 3,
  windowMs: 60 * 60 * 1000,
  message:
    "We have received too many requests from this IP. Please try again after one hour.",
});

app.use("/api", limiter);

// const logger = function (req, res, next) {
//   console.log("custom middleware called");
//   next();
// };

app.use(express.json({ limit: "10kb" }));

// if (process.env.NODE_ENV === "development") {
//   app.use(morgan("dev"));
// }

app.use(express.static("./public"));
// app.use(logger);
// app.use((req, res, next) => {
//   req.requestedAt = new Date().toISOString();
//   next();
// });

app.use("/api/v1/movies", moviesRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRoutes);

app.all("*", (req, res, next) => {
  // res.status(404).json({
  //   status: "fail",
  //   message: `Can't find ${req.originalUrl} on the server!`,
  // });
  const err = new CustomError(
    "Can't find ${req.originalUrl} on the server!",
    404
  );
  // err.status = "fail";
  // err.statusCode = 404;

  next(err);
});

app.use(globalErrorHandler);

module.exports = app;
