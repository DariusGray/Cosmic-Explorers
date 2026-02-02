// controllers/leaderboardController.js
const model = require("../models/leaderboardModel");

module.exports.getTopUsers = (req, res) => {
  model.selectTopUsers((error, results) => {
    if (error) return res.status(500).json({ message: "InternalServer error" });
    return res.status(200).json(results);
  });
};

module.exports.getTopUsersWithLimit = (req, res) => {
  const limit = parseInt(req.params.limit);

  if (isNaN(limit) || limit <= 0) {
    return res.status(400).json({ message: "Limit must be a positive number" });
  }

  model.selectTopUsersWithLimit({ limit }, (error, results) => {
    if (error) return res.status(500).json({ message: "Internal Server error" });
    return res.status(200).json(results);
  });
};
