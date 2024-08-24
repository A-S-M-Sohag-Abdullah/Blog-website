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

const bloggerSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  accountStatus: {
    type: Boolean,
    default: false,
  },
});

const imageSchema = new mongoose.Schema({
  imageTitle: {
    type: String,
  },
  imageurl: {
    type: String,
  },
});

const blogSchema = new mongoose.Schema({
  active: {
    type: Boolean,
    default: false,
  },
  email: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    require: true,
  },
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
const blogerCollection = new mongoose.model("bloger", bloggerSchema);

module.exports = { blogCollection, blogerCollection };
