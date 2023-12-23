const express = require("express");

const port = process.env.PORT;
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const noteRoutes = require("./routes/notes");

const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
var cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const link = process.env.DATABASE;

const db = mongoose.connection;
//Db connection
mongoose.connect(link, {
  dbName: "notes-app",
});
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

//Common Middlewares
app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(process.env.BASE_URL, authRoutes);

app.use(process.env.BASE_URL, userRoutes);

app.use(process.env.BASE_URL, noteRoutes);

app.listen(port, () => {
  console.log("db is running");
});
