const path = require("path");
const express = require("express");
const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { checkforAuthenticationCookie } = require("./middleware/authentication");
const Blog = require("./models/blog");
const app = express();

mongoose.connect("mongodb://localhost:27017/blogify").then(() => {
  console.log("db connected");
});

app.use(express.urlencoded({ urlencoded: false }));
app.use(cookieParser());

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(checkforAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

app.get("/", async (req, res) => {
  const blogs = await Blog.find({}).sort({ createdAt: -1 });
  res.render("home", { user: req.user, blogs });
});
app.use("/user", userRoute);
app.use("/blog", blogRoute);
const PORT = 8000;

app.listen(PORT, () => {
  console.log("server started at ", PORT);
});
