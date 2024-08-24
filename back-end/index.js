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
const { blogCollection, blogerCollection } = require("./db");
const {
  preprocess,
  handleImageUpload,
  generateFileName,
} = require("./utils/preprocess");
const fs = require("fs");
const formidable = require("formidable");
const { saveFile } = require("./utils/fileUpload");
const jwt = require("jsonwebtoken");
const auth = require("./custom middlewares/auth");
const mailto = require("./utils/mailto");

dotenv.config();
const app = express();
const port = process.env.port || 8000;

//middlewares
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//confirm admin authentication
app.get("/adminloggedIn", (req, res) => {
  try {
    //console.log("ss");
    const token = req.cookies.token;

    if (!token) res.send(false);

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (!err) {
        if (decoded.email === process.env.ADMIN_EMAIL) res.send(true);
      } else {
        res.send(false);
      }
    });
  } catch (err) {
    res.send(false);
  }
});

//confirm authentication
app.get("/loggedIn", (req, res) => {
  try {
    //console.log("ss");
    const token = req.cookies.token;

    if (!token) res.send(false);

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (!err) res.send(true);
    });
  } catch (err) {
    res.send(false);
  }
});

app.get("/addblogpermit", auth, (req, res) => {
  const token = req.cookies.token;

  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
    const permit = await blogerCollection.findOne(
      { email: decoded.email },
      "accountStatus"
    );
    res.send(permit);
  });
});

app.get("/logout", (req, res) => {
  res
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    })
    .send(true);
});

//login method
app.post("/login", async (req, res) => {
  try {
    const check = await blogerCollection.findOne({ email: req.body.email });

    if (check.password === req.body.password) {
      const token = jwt.sign(
        {
          email: req.body.email,
        },
        process.env.JWT_SECRET_KEY
      );

      res
        .cookie("token", token, {
          httpOnly: true,
        })
        .send(token);

      //console.log(token);
    } else {
      console.log("false hit 1");
      res.status(401).send(false);
    }
  } catch (e) {
    console.log("false hit 2");
    res.status(401).send(false);
  }
});

//signup method
app.post("/signup", async (req, res) => {
  //console.log(req.body);
  const username = req.body.userName;
  const email = req.body.email;
  const password = req.body.password;

  console.log("signup req rec");
  const check = await blogerCollection.findOne({ email: req.body.email });

  if (!check) {
    console.log("no similar user");
    try {
      const data = new blogerCollection({
        username,
        email,
        password,
      });

      await data.save();

      console.log("data saved");
      const token = jwt.sign(
        {
          email: req.body.email,
        },
        process.env.JWT_SECRET_KEY
      );

      res
        .cookie("token", token, {
          httpOnly: true,
        })
        .send(true);
      console.log("cookie and response send");

      console.log(token);
      //res.redirect("/");
    } catch (err) {
      console.log(err);
      res.send(false);
    }
  } else {
    res.send(false);
  }
});

//get methods
app.get("/", (req, res) => {
  const clientIP = req.ip;
  console.log(`Client IP Address: ${clientIP}`);
  res
    .cookie("name", "sohag", {
      httpOnly: true,
    })
    .send("home");
});

app.get("/adminControl/blogs", async (req, res) => {
  const token = req.cookies.token;
  console.log("asce");
  try {
    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
      const email = decoded.email;
      if (email === process.env.ADMIN_EMAIL) {
        let query = {};
        query.title = { $regex: req.query.title, $options: "i" };
        const data = await blogCollection.find(query).sort({ _id: -1 });
        res.send(data);
      }
    });
  } catch (err) {
    console.log(err.message);
  }
});

// for blogers
app.get("/blogger/blogs", async (req, res) => {
  const token = req.cookies.token;
  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
    const email = decoded.email;
    let query = {};
    query.title = { $regex: req.query.title, $options: "i" };
    query.email = email;
    const data = await blogCollection.find(query);
    res.send(data);
  });
});

// for admin
app.get("/blog", auth, async (req, res) => {
  const token = req.cookies.token;

  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
    if (decoded.email === process.env.ADMIN_EMAIL) {
      try {
        data = await blogCollection.find();
        res.send(data);
      } catch (err) {
        console.log(err.message);
      }
    }
  });
});

// for normal user
app.get("/publicblog", async (req, res) => {
  try {
    data = await blogCollection.find({ active: true }).sort({ _id: -1 });
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

app.get("/bloggerlist", async (req, res) => {
  const token = req.cookies.token;
  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
    if (err) res.status(401).send("unauthorized");

    if (decoded.email !== process.env.ADMIN_EMAIL) res.send(false);
    else {
      let query = {};
      query.email = { $regex: req.query.email, $options: "i" };
      const bloggerList = await blogerCollection.find(query, { password: 0 });

      res.send(bloggerList);
    }
  });
});

//tesing upload route
app.post("/upload", auth, async (req, res) => {
  const token = req.cookies.token;
  const form = new formidable.IncomingForm({ multiples: false });
  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
    try {
      form.parse(req, async (err, fields, files) => {
        if (err) {
          // Handle form parsing error
          console.error("Error parsing form:", err);
          return res.status(500).send("Internal Server Error");
        }

        try {
          console.log(fields);
          const blogData = {
            email: decoded.email,
            category: fields.category[0],
            title: fields.title[0],
            coverImage: {
              imageTitle: fields["coverImage[imageTitle]"][0],
            },
            descriptions: JSON.parse(fields.descriptions[0]),
            descImgPosArr: fields.descImgPosArr[0].split(","),
          };

          const descImgPosArr = fields.descImgPosArr[0].split(",");

          // Access files
          const coverImages = files.coverImage || [];

          if (descImgPosArr[0].length > 0) {
            var descriptionImages =
              descImgPosArr.map(
                (item) => files[`descriptionImage${item}`][0]
              ) || [];
          }

          // Save cover images
          await Promise.all(
            coverImages.map((file) =>
              saveFile(file, generateFileName(file, "coverImage", 0, blogData))
            )
          );

          // Save description images
          if (descriptionImages) {
            await Promise.all(
              descriptionImages.map((file, index) =>
                saveFile(
                  file,
                  generateFileName(file, "descriptionImage", index, blogData)
                )
              )
            );
          }

          console.log(blogData.descriptions);
          const newData = new blogCollection(blogData);
          await newData.save();

          // Send a response
          res.status(200).send(newData);
        } catch (processingError) {
          // Handle errors during file processing or database operations
          console.error(
            "Error processing files or saving to database:",
            processingError
          );
          res.status(500).send("Internal Server Error");
        }
      });
    } catch (formError) {
      // Handle errors related to the form parsing itself
      console.error("Error with form handling:", formError);
      res.status(500).send("Internal Server Error");
    }
  });
});

//put method
app.post("/updateblog/:id", auth, async (req, res) => {
  const id = req.params.id;
  const token = req.cookies.token;

  const form = new formidable.IncomingForm({ multiples: false });
  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
    form.parse(req, async (err, fields, files) => {
      try {
        var data = await blogCollection.findOne({ _id: id });
      } catch (err) {
        console.log(err.message);
      }
      if (data.email === decoded.email) {
        let oldImageUrls = fields.oldImageUrls[0].split(",");

        // old image delete - keep
        oldImageUrls.forEach((element) => {
          const oldImage = `./public/images/${element}`;

          fs.unlink(oldImage, (err) => {
            if (err) console.log(err);
            else {
              console.log("\nprevious file deleted");
            }
          });
        });
        const descImgPosArr = fields.descImgPosArr[0].split(",");

        const coverImages = files.coverImage || [];

        if (descImgPosArr[0].length > 0) {
          var descriptionImages =
            descImgPosArr.map((item) => files[`descriptionImage${item}`][0]) ||
            [];
        }

        const upDatedblogData = {
          title: fields.title[0],
          category: fields.category[0],
          coverImage: {
            imageTitle: fields["coverImage[imageTitle]"][0],
          },
          descriptions: JSON.parse(fields.descriptions[0]),
          descImgPosArr: fields.descImgPosArr[0].split(","),
        };

        await Promise.all(
          coverImages.map((file) =>
            saveFile(
              file,
              generateFileName(
                file,
                (fieldname = "coverImage"),
                0,
                upDatedblogData
              )
            )
          )
        );

        if (descriptionImages) {
          await Promise.all(
            descriptionImages.map((file, index) =>
              saveFile(
                file,
                generateFileName(
                  file,
                  (fieldname = "descriptionImage"),
                  index,
                  upDatedblogData
                )
              )
            )
          );
        }

        //console.log(upDatedblogData);

        try {
          const updatedDocument = await blogCollection.findOneAndUpdate(
            { _id: id },
            upDatedblogData,
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
      } else {
        res.status(401).send("Unauthorized");
      }
    });
  });
});

app.post("/updateblogapproval/:id", auth, async (req, res) => {
  const token = req.cookies.token;
  const id = req.params.id;
  const blogStatus = req.body.blogStatus;
  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
    if (err) res.send("Unauthorized");

    if (decoded.email === process.env.ADMIN_EMAIL) {
      try {
        const updatedDocument = await blogCollection.findOneAndUpdate(
          { _id: id },
          { active: blogStatus }
        );

        const formData = {
          email: process.env.ADMIN_EMAIL,
          reciever: updatedDocument.email,
          subject: "Blog Status",
          text: `Your Blog Status Has Been Changed to ${
            blogStatus ? "Active" : "Hidden"
          } `,
        };
        mailto(formData);

        if (!updatedDocument) {
          return res.status(404).send("Document not found");
        }
        console.log(updatedDocument);
        return res.send(true);
      } catch (err) {
        console.log(err.message);
        return res.status(400).send(err.message);
      }
    }
  });
});

app.post("/updateblogger/:id", auth, async (req, res) => {
  const token = req.cookies.token;
  const id = req.params.id;
  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
    if (decoded.email !== process.env.ADMIN_EMAIL) {
      res.send("Only admin can do this");
    } else {
      //console.log(req.body);
      try {
        const updatedDocument = await blogerCollection.findOneAndUpdate(
          { _id: id },
          req.body,
          { new: true }
        );
        const formData = {
          email: process.env.ADMIN_EMAIL,
          reciever: updatedDocument.email,
          subject: "Blogger Status",
          text: `Your Blogger Status is changed to ${
            req.body.accountStatus ? "Active" : "Hidden"
          } `,
        };
        mailto(formData);

        if (!updatedDocument) {
          return res.status(404).send("Document not found");
        }
        console.log(updatedDocument);
        return res.json(updatedDocument);
      } catch (err) {
        console.log(err.message);
        return res.status(400).send(err.message);
      }
    }
  });
});

//delete method
app.post("/deleteblog/:id", auth, async (req, res) => {
  const token = req.cookies.token;
  const id = req.params.id;
  const oldDocument = await blogCollection.findOne({ _id: id });
  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
    if (decoded.email !== oldDocument.email) {
      res.status(401).send("unauthorized");
    }
  });
  try {
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
