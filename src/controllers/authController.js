const authModel = require("../models/authModel");

//////////////////////////////////////////////////////
// VALIDATE REGISTER BODY
//////////////////////////////////////////////////////
module.exports.validateRegisterBody = (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  next();
};

//////////////////////////////////////////////////////
// CHECK USERNAME/EMAIL CONFLICT
//////////////////////////////////////////////////////
module.exports.checkRegisterConflict = (req, res, next) => {
  const data = { username: req.body.username, email: req.body.email };

  authModel.checkUsernameOrEmailExists(data, (err, results) => {
    if (err) {
      console.error("Error checkRegisterConflict:", err);
      return res.status(500).json({ message: "Server error" });
    }

    if (results.length > 0) {
      return res.status(409).json({ message: "Username or email already exists" });
    }

    next();
  });
};

//////////////////////////////////////////////////////
// CREATE USER (after bcrypt hash)
//////////////////////////////////////////////////////
module.exports.registerUser = (req, res, next) => {
  const data = {
    username: req.body.username,
    email: req.body.email,
    password_hash: res.locals.hash,
  };

  authModel.insertSingleAuthUser(data, (err, results) => {
    if (err) {
      console.error("Error registerUser:", err);
      return res.status(500).json({ message: "Server error" });
    }

    res.locals.userId = results.insertId;
    res.locals.user = {
      user_id: results.insertId,
      username: req.body.username,
      email: req.body.email,
      points: 0,
      latest_discovered_planet: null,
    };

    res.locals.message = `User ${req.body.username} registered successfully.`;
    next();
  });
};


//////////////////////////////////////////////////////
// VALIDATE LOGIN BODY
//////////////////////////////////////////////////////
module.exports.validateLoginBody = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Missing email or password" });
  }

  next();
};

//////////////////////////////////////////////////////
// LOAD USER BY EMAIL (store hash for bcrypt compare)
//////////////////////////////////////////////////////
module.exports.loadUserByEmail = (req, res, next) => {
  const data = { email: req.body.email };

  authModel.selectByEmail(data, (err, results) => {
    if (err) {
      console.error("Error loadUserByEmail:", err);
      return res.status(500).json({ message: "Server error" });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = results[0];

    res.locals.hash = user.password_hash;
    res.locals.userId = user.user_id;
    res.locals.user = {
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      points: user.points,
      latest_discovered_planet: user.latest_discovered_planet,
    };

    next();
  });
};

//////////////////////////////////////////////////////
// AFTER PASSWORD VERIFIED, PREPARE TOKEN RESPONSE
//////////////////////////////////////////////////////
module.exports.beforeSendLoginToken = (req, res, next) => {
  res.locals.message = "Login successful.";
  next();
};

//////////////////////////////////////////////////////
// SEND USER PROFILE WITH TOKEN
//////////////////////////////////////////////////////
module.exports.sendLoginResponse = (req, res) => {
  return res.status(200).json({
    message: res.locals.message,
    token: res.locals.token,
    user: res.locals.user,
  });
};
