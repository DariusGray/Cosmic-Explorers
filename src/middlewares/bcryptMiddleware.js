//////////////////////////////////////////////////////
// REQUIRE BCRYPT MODULE
//////////////////////////////////////////////////////
const bcrypt = require("bcrypt");

//////////////////////////////////////////////////////
// SET SALT ROUNDS
//////////////////////////////////////////////////////
const saltRounds = 10;

//////////////////////////////////////////////////////
// MIDDLEWARE FUNCTION FOR COMPARING PASSWORD
//////////////////////////////////////////////////////
module.exports.comparePassword = (req, res, next) => {
  const plain = res.locals.password ?? req.body.password;
  const hash = res.locals.hash;

  if (!plain || !hash) {
    return res.status(500).json({ message: "Password compare missing data" });
  }

  bcrypt.compare(plain, hash, (err, isMatch) => {
    if (err) {
  console.error("Error bcrypt:", err);
  return res.status(500).json({ message: "Server error" });
}

    if (!isMatch) {
      return res.status(401).json({ message: "Wrong password" });
    }

    return next();
  });
};

//////////////////////////////////////////////////////
// MIDDLEWARE FUNCTION FOR HASHING PASSWORD
//////////////////////////////////////////////////////
module.exports.hashPassword = (req, res, next) => {
  const callback = (err, hash) => {
    if (err) {
  console.error("Error bcrypt:", err);
  return res.status(500).json({ message: "Server error" });
  } else {
      res.locals.hash = hash;
      next();
    }
  };

  bcrypt.hash(req.body.password, saltRounds, callback);
};
