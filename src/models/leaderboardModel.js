// models/leaderboardModel.js
const pool = require("../services/db");

module.exports.selectTopUsers = (callback) => {
  const SQLSTATEMENT = `
    SELECT user_id, username, points
    FROM User
    ORDER BY points DESC
    LIMIT 5;
  `;
  pool.query(SQLSTATEMENT, callback);
};

module.exports.selectTopUsersWithLimit = (data, callback) => {
  const SQLSTATEMENT = `
    SELECT user_id, username, points
    FROM User
    ORDER BY points DESC
    LIMIT ?;
  `;
  pool.query(SQLSTATEMENT, [data.limit], callback);
};
