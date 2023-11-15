const User = require("../models/user");
const expressJwt = require("express-jwt");
const jwt = require("jsonwebtoken");
const { authValidator, loginValidator } = require("../validations/auth");

//Register
exports.Register = async (req, res) => {
  const user = new User(req.body);

  const { error } = authValidator.validate(req.body);

  if (error) {
    return res.status(400).json({
      error: error.details[0].message,
    });
  }

  try {
    const existingUser = await User.findOne({ email: user.email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Save new user to the DB
    await user.save();

    res.json({
      email: user.email,
      firstName : user.firstName,
      lastName : user.lastName,
      id: user._id,
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({
      error: "Unable to save user to the db",
    });
  }
};

//Login

exports.login = (req, res) => {
  const { email } = req.body;

  const { error } = loginValidator.validate(req.body);

  if (error) {
    return res.status(400).json({
      error: error.details[0].message,
    });
  }

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

      const { _id, email } = user;
      return res.json({
        token,
        user: { _id, email},
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
    message: "User logged out successfully",
  });
};

