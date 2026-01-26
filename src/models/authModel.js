const pool = require("../services/db");

//////////////////////////////////////////////////////
// Find user by email (for login)
//////////////////////////////////////////////////////
module.exports.selectByEmail = (data, callback) => {
  const SQLSTATEMENT = `
    SELECT user_id, username, email, password_hash, points, latest_discovered_planet
    FROM User
    WHERE email = ?;
  `;
  pool.query(SQLSTATEMENT, [data.email], callback);
};

//////////////////////////////////////////////////////
// Check username or email exists (for register)
//////////////////////////////////////////////////////
module.exports.checkUsernameOrEmailExists = (data, callback) => {
  const SQLSTATEMENT = `
    SELECT user_id
    FROM User
    WHERE username = ? OR email = ?;
  `;
  pool.query(SQLSTATEMENT, [data.username, data.email], callback);
};

//////////////////////////////////////////////////////
// Insert new user (register)
//////////////////////////////////////////////////////
module.exports.insertSingleAuthUser = (data, callback) => {
  const SQLSTATEMENT = `
    INSERT INTO User (username, email, password_hash, points, latest_discovered_planet)
    VALUES (?, ?, ?, 0, 'Mercury Outpost – First Launch');
  `;
  const VALUES = [data.username, data.email, data.password_hash];
  pool.query(SQLSTATEMENT, VALUES, callback);
};
