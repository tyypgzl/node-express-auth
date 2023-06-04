// 3th party
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { requireAuth, checkUser } = require("./middleware/authMiddleware");
require("dotenv").config();

// Routes
const authRoutes = require("./routes/authRoutes");

const app = express();

// middleware
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set("view engine", "ejs");

// database connection
const dbURI = "mongodb://localhost:27017/users";
mongoose
  .connect(dbURI)
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));

// Routes
app.get("*", checkUser);
app.get("/", (req, res) => res.render("home"));
app.get("/smoothies", requireAuth, (req, res) => res.render("smoothies"));
app.use(authRoutes);

// // Cookies
// app.get("/set-cookies", (req, res) => {
//   //res.setHeader("Set-Cookie", "newUser=true");
//   res.cookie("newUser", false);
//   res.cookie("isEmployee", true, {
//     maxAge: 1000 * 60 * 60 * 24,
//     /*secure: true*/ httpOnly: true,
//   });
//   res.send("You got the cookies!");
// });
// app.get("/read-cookies", (req, res) => {
//   const cookies = req.cookies;

//   res.json(cookies);
// });
