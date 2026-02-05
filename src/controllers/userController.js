const model = require("../models/userModel.js");

module.exports.readAllUser = (req, res) => {
  model.selectAll((error, results) => {
    if (error) {
      console.error("Error readAllUser:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
    return res.status(200).json(results);
  });
};

module.exports.readUserById = (req, res) => {
  const id = res.locals.user_id === undefined ? req.params.user_id : res.locals.user_id;
  const data = { id: id };

  model.selectById(data, (error, results) => {
    if (error) {
      console.error("Error readUserById:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(results[0]);
  });
};

module.exports.readUserByUsername = (req, res, next) => {
  if (req.body.username === undefined) {
    return res.status(400).json({ message: "Error: The input body can't be empty!" });
  }

  if (req.params.user_id !== undefined && req.body.points !== undefined) {
    res.locals.user_id = req.params.user_id;
    res.locals.points = req.body.points;
  }

  const data = { username: req.body.username };

  model.selectByUsername(data, (error, results) => {
    if (error) {
      console.error("Error readUserByUsername:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }

    if (results.length !== 0) {
      if (req.params.user_id === undefined) {
        return res.status(409).json({ message: "Error! Username Already Exists!" });
      }

      if (parseInt(results[0].user_id) !== parseInt(req.params.user_id)) {
        return res.status(409).json({ message: "Error! Username Already Exists!" });
      }
    }

    res.locals.username = req.body.username;
    next();
  });
};


module.exports.readUserCompletionsByUserId = (req, res) => {
  const data = { user_id: req.params.user_id };

  model.selectCompletionsByUserId(data, (error, results) => {
    if (error) {
      console.error("Error readUserCompletionsByUserId:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }

    return res.status(200).json(results);
  });
};
