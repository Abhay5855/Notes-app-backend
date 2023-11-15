const User = require("../models/user");
const expressJwt = require("express-jwt");
const jwt = require("jsonwebtoken");


//Register
exports.Register = (req, res) => {
  const user = new User(req.body);

  user
    .save()
    .then(() => {
      res.json({
        email: user.email,
        userName: user.userName,
        id: user._id,
      });
    })
    .catch((err) => {
      if (err) {
        return res.status(400).json({
          error: "Unable to save user to the db",
        });
      }
    });
};

//Login

exports.login = (req, res) => {
  // adding the cookie
  // find the user

  const { email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(400).json({
          error: "Not able to find the user",
        });
      }

      // create token
     var token = jwt.sign({ _id: user._id }, "shhhhh");

     res.cookie("token", token, { expire: new Date() + 9999 });

     const { _id, userName, email } = user;
    return res.json({
      token,
      user: { _id, email, userName},
      userId: user._id,
    });


    })
    .catch((err) => {
      if (err) {
        return res.status(400).json({
          error: "Unable to login",
        });
      }
    });
};


exports.Logout = (req, res) => {

        // clear cookie
        res.clearCookie("token");

        return res.json({

           message : "User logged out successfully"
        })
}
