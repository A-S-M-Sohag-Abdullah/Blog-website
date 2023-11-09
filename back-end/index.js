/**
 * Date : 12-oct-23
 * Title : Blog website backend
 * Description : A Blog sharing website
 * Author : A. S. M. Sohag Abdullah
 */

//dependencies
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const { blogCollection } = require("./db");
const { preprocess } = require("./utils/preprocess");
const multer = require("multer");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    try {
      console.log("line 23");
      console.log(req.body);
      //const descriptions = req.body.descriptions;
      if (typeof req.body.descriptions !== "object") {
        req.body.descriptions = JSON.parse(req.body.descriptions);
      }
      if (!Array.isArray(req.body.descImgPosArr))
        req.body.descImgPosArr = req.body.descImgPosArr.split(",");

      /* console.log(isValidJSON(req.body.descriptions)); */
      //console.log('line 30' + typeof req.body.descriptions );
      //console.log(req.body);

      //console.log(file);
      cb(null, "./public/images");
    } catch (err) {
      console.log("asdasd" + err);
    }
  },
  filename: function (req, file, cb) {
    const d = new Date();
    let time = d.getTime();
    const uniqueSuffix = time;
    try {
      const filename =
        file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname);

      if (file.fieldname === "coverImage") {
        req.body.coverImage.imageurl = filename;
        req.body.descImgPosArr = req.body.descImgPosArr.sort();
      } else if (file.fieldname === "descriptionImage") {
        if (
          !req.body.descriptions[parseInt(req.body.descImgPosArr[0])]
            .descriptionImage.imageurl
        ) {
          req.body.descriptions[
            parseInt(req.body.descImgPosArr[0])
          ].descriptionImage.imageurl = filename;
          console.log(
            req.body.descriptions[parseInt(req.body.descImgPosArr[0])]
              .descriptionImage.imageurl
          );
          req.body.descImgPosArr.shift();
        }
      }
      cb(null, filename);
    } catch (err) {
      console.log("file saving error" + err.message);
    }
  },
});
dotenv.config();
const app = express();
const port = process.env.port || 8000;
const upload = multer({ storage: storage });

//middlewares
app.use(cors({ origin: ["http://localhost:3000"], credentials: true }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//get methods
app.get("/", (req, res) => {
  res
    .cookie("name", "sohag", {
      httpOnly: true,
    })
    .send("home");
});

app.get("/blog", async (req, res) => {
  try {
    data = await blogCollection.find();
    res.send(data);
  } catch (err) {
    console.log(err.message);
  }
});

app.get("/blog/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const data = await blogCollection.findOne({ _id: id });
    /* console.log(data); */
    res.status(200).json(data);
  } catch (err) {
    console.log(err.message);
  }
});

const cpUpload = upload.fields([
  { name: "coverImage", maxCount: 1 },
  { name: "descriptionImage", maxCount: 8 },
]);
/* function preprocess(req,res,next){
  if (typeof req.body.descriptions !== "object") {
    req.body.descriptions = JSON.parse(req.body.descriptions);
  }
  req.body.descImgPosArr =   req.body.descImgPosArr.split(',').map(Number);

  next();
} */
//post method
app.post("/saveblog", cpUpload, async (req, res) => {
  try {
    const data = new blogCollection(req.body);
    const blog = await data.save();
    console.log(blog._id);
    res.send(blog._id);
  } catch (err) {
    console.log(err.message);
  }
});

//put method
app.post("/updateblog/:id", upload.single("coverImage"), async (req, res) => {
  const id = req.params.id;
  let updatedData = req.body;
  try {
    const oldDocument = await blogCollection.findOne({ _id: id });
    //console.log("assssss" + oldDocument.imageurl);

    console.log(req.file, req.body);
    if (!req.file) req.body.imageurl = oldDocument.imageurl;
    else {
      fs.unlink(`./public/images/${oldDocument.imageurl}`, (err) => {
        if (err) console.log(err);
        else {
          console.log("\nprevious file deleted");
        }
      });
    }
    updatedData = req.body;
    // res.send(oldDocument);
  } catch (err) {
    console.log(err.message);
  }

  try {
    const updatedDocument = await blogCollection.findOneAndUpdate(
      { _id: id },
      updatedData,
      { new: true }
    );

    if (!updatedDocument) {
      return res.status(404).send("Document not found");
    }
    console.log(updatedDocument);
    return res.json(updatedDocument);
  } catch (err) {
    console.log(err.message);
    return res.status(400).send(err.message);
  }
});

//delete method
app.post("/deleteblog/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const oldDocument = await blogCollection.findOne({ _id: id });
    const oldImage = `./public/images/${oldDocument.imageurl}`;

    fs.unlink(oldImage, (err) => {
      if (err) console.log(err);
      else {
        console.log("\nprevious file deleted");
      }
    });

    const deletedDocument = await blogCollection.findOneAndDelete({ _id: id });
    console.log(deletedDocument);
    res.send(true);
  } catch (err) {
    console.log(err.message);
  }
});

app.listen(port, () => {
  console.log(`Application started on port ${port}`);
});
