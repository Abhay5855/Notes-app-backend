const expressJwt = require("express-jwt");

exports.isSignedin = expressJwt({
  secret: "shhhhh",
  userProperty: "auth",
});

exports.isAuthenticated = (req, res, next) => {
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;

  console.log(checker);

  if (!checker) {
    return res.status(403).json({
      error: "ACCESS DENIED",
    });
  }

  next();
};
