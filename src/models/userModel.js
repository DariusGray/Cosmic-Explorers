const pool = require("../services/db");

module.exports.selectAll = (callback) => {
  const SQLSTATMENT = `
    SELECT user_id, username, points, latest_discovered_planet
    FROM User;
  `;
  pool.query(SQLSTATMENT, callback);
};

module.exports.selectById = (data, callback) => {
  const SQLSTATMENT = `
    SELECT user_id, username, points, latest_discovered_planet
    FROM User
    WHERE user_id = ?;
  `;
  pool.query(SQLSTATMENT, [data.id], callback);
};

module.exports.selectByUsername = (data, callback) => {
  const SQLSTATMENT = `
    SELECT user_id, username
    FROM User
    WHERE username = ?;
  `;
  pool.query(SQLSTATMENT, [data.username], callback);
};

module.exports.insertSingle = (data, callback) => {

  const SQLSTATMENT = `
    INSERT INTO User (username, email, password_hash, points)
    VALUES (?, ?, ?, 0);
  `;
  pool.query(SQLSTATMENT, [data.username, data.email, data.password_hash], callback);
};

module.exports.updateById = (data, callback) => {
  const SQLSTATMENT = `
    UPDATE User
    SET username = ?, points = ?
    WHERE user_id = ?;
  `;
  const VALUES = [data.username, data.points, data.id];
  pool.query(SQLSTATMENT, VALUES, callback);
};

module.exports.selectCompletionsByUserId = (data, callback) => {
  const SQLSTATMENT = `
    SELECT 
      uc.completion_id,
      uc.challenge_id,
      wc.description AS challenge_description,
      wc.points AS challenge_points,
      uc.details
    FROM UserCompletion uc
    JOIN WellnessChallenge wc
      ON uc.challenge_id = wc.challenge_id
    WHERE uc.user_id = ?
    ORDER BY uc.completion_id DESC;
  `;
  pool.query(SQLSTATMENT, [data.user_id], callback);
};

