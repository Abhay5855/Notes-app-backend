const express = require("express");

const port = 8000;
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const noteRoutes = require("./routes/notes");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
var cors = require("cors");
const mongoose = require("mongoose");


const db = mongoose.connection;
//Db connection
mongoose
  .connect("mongodb://127.0.0.1:27017/notes-app", {
    dbName : 'notes-app',
  })
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

//Common Middlewares
app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api", authRoutes);

app.use("/api" , userRoutes);

app.use("/api" , noteRoutes);

app.listen(port, () => {
  console.log("db is running");
});
