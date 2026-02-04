const model = require("../models/leaderboardModel");

module.exports.getTopUsers = (req, res) => {
  model.selectTopUsers((error, results) => {
    if (error) return res.status(500).json({ message: "Internal Server Error" });
    return res.status(200).json(results);
  });
};
