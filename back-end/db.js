/**
 * Date : 12-oct-23
 * Title : Blog website database
 * Description : Database Schemas
 * Author : A. S. M. Sohag Abdullah
 */

//dependencies
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/blog-website")
  .then(() => {
    console.log("mongoose connected");
  })
  .catch((e) => {
    console.log("failed");
  });

/* const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  imageurl: {
    type: String,
    required: true,
  },
  descriptions: [
    {
      type: String,
    },
  ],
  date: {
    type: Date,
    default: new Date(),
  },
}); */

const imageSchema = new mongoose.Schema({
  imageTitle: {
    type: String,
  },
  imageurl: {
    type: String,
  },
});

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  coverImage: { type: imageSchema, required: true },
  descriptions: [
    {
      description: {
        type: String,
        default: null,
      },
      descriptionImage: { type: imageSchema, default: null },
      videoUrl: {
        type: String,
        default: null,
      },
    },
  ],
  date: {
    type: Date,
    default: new Date(),
  },
});

const blogCollection = new mongoose.model("blog", blogSchema);

module.exports = { blogCollection };
