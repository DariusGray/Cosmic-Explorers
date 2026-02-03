const pool = require("../services/db");

module.exports.selectAllPlanets = (data, callback) => {
  const SQLSTATEMENT = `
    SELECT planet_id, name, unlock_points
    FROM Planet
    ORDER BY unlock_points ASC;
  `;
  pool.query(SQLSTATEMENT, callback);
};

module.exports.selectUserById = (data, callback) => {
  const SQLSTATEMENT = `
    SELECT user_id, points, latest_discovered_planet
    FROM User
    WHERE user_id = ?;
  `;
  pool.query(SQLSTATEMENT, [data.user_id], callback);
};

module.exports.selectEligiblePlanets = (data, callback) => {
  const SQLSTATEMENT = `
    SELECT p.planet_id, p.name, p.unlock_points
    FROM Planet p
    LEFT JOIN UserPlanet up
      ON up.planet_id = p.planet_id AND up.user_id = ?
    WHERE p.unlock_points <= ?
      AND up.planet_id IS NULL
    ORDER BY p.unlock_points ASC;
  `;
  pool.query(SQLSTATEMENT, [data.user_id, data.points], callback);
};

module.exports.insertUserPlanet = (data, callback) => {
  const SQLSTATEMENT = `
    INSERT IGNORE INTO UserPlanet (user_id, planet_id)
    VALUES (?, ?);
  `;
  pool.query(SQLSTATEMENT, [data.user_id, data.planet_id], callback);
};

module.exports.selectUserPlanets = (data, callback) => {
  const SQLSTATEMENT = `
    SELECT p.planet_id, p.name, p.unlock_points, up.unlocked_at
    FROM UserPlanet up
    JOIN Planet p ON up.planet_id = p.planet_id
    WHERE up.user_id = ?
    ORDER BY p.unlock_points ASC;
  `;
  pool.query(SQLSTATEMENT, [data.user_id], callback);
};

module.exports.updateUserLatestPlanet = (data, callback) => {
  const SQLSTATEMENT = `
    UPDATE User
    SET latest_discovered_planet = ?
    WHERE user_id = ?;
  `;
  pool.query(SQLSTATEMENT, [data.planet_name, data.user_id], callback);
};
