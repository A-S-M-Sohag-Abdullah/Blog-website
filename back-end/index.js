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
const multer  = require('multer');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images')
  },
  filename: function (req, file, cb) {
    const d = new Date();
    let time = d.getTime();
    const uniqueSuffix = time;
    req.body.imageurl = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
    cb(null,  req.body.imageurl);
  }
})
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

app.get("/", (req, res) => {
  res
    .cookie("name", "sohag", {
      httpOnly: true,
    })
    .send("home");
});



app.post("/saveblog", upload.single('cover'), async (req, res) => {
  const title = req.body.title;
  const imageurl =  req.body.imageurl;
  const descriptions = req.body.descriptions;

  console.log(req.body , req.file);

  try {
    const data = new blogCollection({
      title,
      imageurl,
      descriptions,
    });

    const blog = await data.save();
    console.log(blog._id);
    res.send(blog._id);
  } catch (err) {
    console.log(err.message);
  }
});

app.listen(port, () => {
  console.log(`Application started on port ${port}`);
});
