const mongoose = require("mongoose");
const fs = require("fs");
const validator = require("validator");

const movieSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required field!"],
      unique: true,
      maxlength: [100, "Movie name must not have more than 100 characters"],
      minlength: [4, "Movie name must have at least 4 characters"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required field!"],
      unique: true,
      trim: true,
    },
    duration: {
      type: Number,
      required: [true, "Duration is requird field!"],
    },
    ratings: {
      type: Number,
      validate: function (value) {
        return value >= 1 && value <= 10;
      },
      message: (props) => `Ratings should be above 1 and below 10!`,
    },
    // totalRating: {
    //   type: Number,
    // },
    // releaseYear: {
    //   type: Number,
    //   required: [true, "Release year is required field!"],
    // },
    // releaseDate: {
    //   type: Date,
    // },
    // createdAt: {
    //   type: Date,
    //   default: Date.now(),
    // },
    //   genres: {
    //     type: String,
    //     required: [true, "Cover image is required field!"],
    //   },
    //   directors: {
    //     type: String,
    //     required: [true, "Directors is required field!"],
    //   },
    //   coverImage: {
    //     type: String,
    //     required: [true, "coverImage is required field!"],
    //   },
    //   actors: {
    //     type: String,
    //     required: [true, "actors is required field!"],
    //   },
    //   price: {
    //     type: Number,
    //     required: [true, "Price is required field!"],
    //   },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

movieSchema.virtual("duationInHours").get(function () {
  return this.duration / 60;
});

movieSchema.pre("save", function (next) {
  this.createdBy = "Bolarinwa";
  next();
});

movieSchema.post("save", function (doc, next) {
  const content = `A new content with name ${doc.name} has been created by ${doc.createdBy}\n`;
  fs.writeFileSync("./log/log.txt", content, { flag: "a" }, (err) => {
    console.log(err.message);
  });
  next();
});
const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;
