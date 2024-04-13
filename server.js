const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const mongoose = require("mongoose");
const app = require("./app");

console.log(process.env);

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("==============");
  console.log("connected to database successfully");
});
// .catch((err) => {
//   console.log("==============");
//   console.log("error connecting to MongoDB");
// });

const port = process.env.PORT || 4000;

const server = app.listen(port, () => {
  console.log("server has started...");
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("unhandled rejection occured! Shutting down...");

  server.close(() => {
    process.exit(1);
  });
});
