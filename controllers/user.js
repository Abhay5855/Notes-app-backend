const User = require("../models/user");

//get all users
exports.getAllUsers = (req, res) => {
  const { email } = req.body;

  // If an email is provided, filter users by email
  const query = email ? { email } : {};

  User.find(query)
    .exec()
    .then((users) => {
      if (!users || users.length === 0) {
        return res.status(404).json({
          error: "No users found",
        });
      }

      const sanitizedResult = users.map((user) => {
        user.salt = undefined;
        user.encrpt_password = undefined;
        user.createdAt = undefined;
        user.updatedAt = undefined;

        return user;
      });

      res.json(sanitizedResult);
    })
    .catch((err) => {
      return res.status(400).json({
        error: "Unable to fetch users",
      });
    });
};

//get user by id

exports.getUserByID = (req, res, next, id) => {
  User.findById(id)
    .exec()
    .then((users) => {
      if (!users) {
        return err.status(400).json({
          error: "User does not exist",
        });
      }

      req.profile = users;
      next();
    })
    .catch((err) => {

    if(err){
        return res.status(500).json({
            error: "Unable to fetch users",
          });
    }
      
    });
};

// Get User

exports.getUser = (req, res) => {

    req.profile.salt = undefined;
    req.profile.encrpt_password = undefined;
    req.profile.createdAt = undefined;
    req.profile.updatedAt = undefined;

    return res.json(req.profile);
}


