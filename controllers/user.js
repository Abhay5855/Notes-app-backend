const User = require("../models/user");

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
        console.error(err);
        return res.status(400).json({
          error: "Unable to fetch users",
        });
      });
  };
