//////////////////////////////////////////////////////
// REQUIRE DATABASE
//////////////////////////////////////////////////////
const pool = require("../services/db");

//////////////////////////////////////////////////////
// INSERT CHALLENGE
//////////////////////////////////////////////////////
module.exports.insertSingle = (data, callback) => {
  const SQLSTATEMENT = `
    INSERT INTO WellnessChallenge (description, points, creator_id)
    VALUES (?, ?, ?);
  `;
  const VALUES = [data.description, data.points, data.user_id];
  pool.query(SQLSTATEMENT, VALUES, callback);
};

//////////////////////////////////////////////////////
// SELECT ALL CHALLENGES
//////////////////////////////////////////////////////
module.exports.selectAll = (callback) => {
  const SQLSTATEMENT = `
    SELECT challenge_id, description, points, creator_id
    FROM WellnessChallenge;
  `;
  pool.query(SQLSTATEMENT, callback);
};

//////////////////////////////////////////////////////
// SELECT CHALLENGE BY ID
//////////////////////////////////////////////////////
module.exports.selectById = (data, callback) => {
  const SQLSTATEMENT = `
    SELECT challenge_id, description, points, creator_id
    FROM WellnessChallenge
    WHERE challenge_id = ?;
  `;
  pool.query(SQLSTATEMENT, [data.id], callback);
};

//////////////////////////////////////////////////////
// UPDATE CHALLENGE
//////////////////////////////////////////////////////
module.exports.updateById = (data, callback) => {
  const SQLSTATEMENT = `
    UPDATE WellnessChallenge
    SET description = ?, points = ?
    WHERE challenge_id = ?;
  `;
  const VALUES = [data.description, data.points, data.challenge_id];
  pool.query(SQLSTATEMENT, VALUES, callback);
};

//////////////////////////////////////////////////////
// DELETE CHALLENGE COMPLETIONS
//////////////////////////////////////////////////////
module.exports.deleteCompletionsByChallengeId = (data, callback) => {
  const SQLSTATEMENT = `
    DELETE FROM UserCompletion
    WHERE challenge_id = ?;
  `;
  pool.query(SQLSTATEMENT, [data.id], callback);
};

//////////////////////////////////////////////////////
// DELETE CHALLENGE
//////////////////////////////////////////////////////
module.exports.deleteById = (data, callback) => {
  const SQLSTATEMENT = `
    DELETE FROM WellnessChallenge
    WHERE challenge_id = ?;
  `;
  pool.query(SQLSTATEMENT, [data.id], callback);
};

//////////////////////////////////////////////////////
// SELECT USERS BY CHALLENGE
//////////////////////////////////////////////////////
module.exports.selectUsersByChallengeId = (data, callback) => {
  const SQLSTATEMENT = `
    SELECT user_id, details
    FROM UserCompletion
    WHERE challenge_id = ?;
  `;
  pool.query(SQLSTATEMENT, [data.id], callback);
};

//////////////////////////////////////////////////////
// INSERT COMPLETION
//////////////////////////////////////////////////////
module.exports.insertCompletion = (data, callback) => {
  const SQLSTATEMENT = `
    INSERT INTO UserCompletion (challenge_id, user_id, details)
    VALUES (?, ?, ?);
  `;
  const VALUES = [data.challenge_id, data.user_id, data.details];
  pool.query(SQLSTATEMENT, VALUES, callback);
};

//////////////////////////////////////////////////////
// CHECK USER EXISTS
//////////////////////////////////////////////////////
module.exports.selectUserById = (data, callback) => {
  const SQLSTATEMENT = `
    SELECT user_id
    FROM User
    WHERE user_id = ?;
  `;
  pool.query(SQLSTATEMENT, [data.user_id], callback);
};

//////////////////////////////////////////////////////
// ADD POINTS TO USER
//////////////////////////////////////////////////////
module.exports.addPointsToUser = (data, callback) => {
  const SQLSTATEMENT = `
    UPDATE User
    SET points = points + ?
    WHERE user_id = ?;
  `;
  const VALUES = [data.points_to_add, data.user_id];
  pool.query(SQLSTATEMENT, VALUES, callback);
};
