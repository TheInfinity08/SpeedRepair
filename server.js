// --------------------------------<< EXPRESS >>----------------------------------------------------------------- //
// speedRepair --> username
// 08speedRepair12 --> password
// jshint esversion:6

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

const https = require("https");
const { url } = require("inspector");
const { json } = require("body-parser");
const cookieParser = require("cookie-parser");
app.use(express.static("public"));
app.use(express.static("app"));
const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
// const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
const { userInfo } = require("os");
// const User = require("./app/models/User")
const jwtSecret = "hasjlkdhaudsygfenbahgss";

const port = 3000;

const partsArr = [];

mongoose
  .connect(
    "mongodb+srv://speedRepair:08speedRepair12@cluster0.656h2xx.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to MongoDB Atlas!");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB Atlas:", error);
  });
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
// app.use(cors({
//     credentials: true,
//     origin: "http://127.0.0.1:8000"
// }))
// const bcryptSalt = bcrypt.genSaltSync(10);
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: { type: String, unique: true },
});

const User = mongoose.model("User", userSchema);

var globalToken;

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/Homepage.html");
});

app.get("/parts", (req, res) => {
  res.sendFile(__dirname + "/Parts.html");
  const { token } = req.cookies;
  // console.log(token);
});
app.post("/parts", (req, res) => {
  partsArr.push(req.body);
  res.send({ userCart: partsArr });
});

app.get("/signin", (req, res) => {
  res.sendFile(__dirname + "/Signin.html");
});
app.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  let user = await User.findOne({ email: req.body.email }).exec();

  // console.log(req.body)
  if (user) {
    if (password === user.password) {
      jwt.sign(
        { email: user.email, id: user._id },
        jwtSecret,
        {},
        (err, token) => {
          globalToken = token;
          if (err) throw err;
          res.cookie("token", token).json(user);
          res.send({ status: true });
        }
      );
    } else {
      // res.status(422).json("pass not ok");
    }
  } else {
    // console.log(null) Show error Code
  }
});

app.get("/signup", (req, res) => {
  res.sendFile(__dirname + "/Signup.html");
});
app.post("/signup", async (req, res) => {
  var recFound = false;

  let user = await User.findOne({ email: req.body.email }).exec();

  if (user) {
    console.log("User Already Exists!!");
  } else {
    const user = await User.create({
      email: req.body.email,
      password: req.body.password,
    });

    user
      .save()
      .then(() => {
        console.log("New object saved to MongoDB Atlas!" + user);
        res.send({ status: true });
      })
      .catch((error) => {
        console.error("Error saving object to MongoDB Atlas:", error);
      });
  }
});

app.get("/productpage", (req, res) => {
  res.sendFile(__dirname + "/ProductPage.html");
});

app.get("/logout", (req, res) => {});
app.post("/logout", (req, res) => {
  res.cookie("token", "");
  res.send({ status: true });
});

app.get("/cart", (req, res) => {
  res.sendFile(__dirname + "/Cart.html");
});
app.post("/cart", (req, res) => {
  // console.log(partsArr);
  res.send({ userCart: partsArr });
});

app.post("/changeCart", (req, res)=>{
  var total = 0;
  partsArr.splice(req.body.index, 1);
  for (let i = 0; i < partsArr.length; i++) {
    total += partsArr[i].price;
  }
  console.log(total);
  res.send({ userCart : partsArr, total: total });
});

app.listen(port, () => {
  console.log("Server started on port " + port);
});
