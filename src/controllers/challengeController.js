const model = require("../models/challengeModel");

//////////////////////////////////////////////////////
// POST /challenges
//////////////////////////////////////////////////////
module.exports.createNewChallenge = (req, res, next) => {
  const description = req.body.description;
  const user_id = req.body.user_id;
  const points = req.body.points;

  if (!description || user_id === undefined || points === undefined) {
    return res.status(400).json({ message: "Please fill in all the fields" });
  }

  const data = {
    description: description,
    user_id: user_id,
    points: points,
  };

  const callback = (error, results) => {
    if (error) {
      console.error("Error createNewChallenge:", error);
      return res.status(500).json({ message: "Server error" });
    }

    res.locals.challenge_id = results.insertId;
    next();
  };

  model.insertSingle(data, callback);
};

module.exports.readChallengeByIdAfterCreate = (req, res) => {
  const data = { id: res.locals.challenge_id };

  const callback = (error, results) => {
    if (error) {
      console.error("Error readChallengeByIdAfterCreate:", error);
      return res.status(500).json({ message: "Server error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    const row = results[0];
    res.status(201).json({
      challenge_id: row.challenge_id,
      challenge: row.description,
      creator_id: row.creator_id,
      points: row.points,
    });
  };

  model.selectById(data, callback);
};

//////////////////////////////////////////////////////
// GET /challenges
//////////////////////////////////////////////////////
module.exports.readAllChallenges = (req, res) => {
  const callback = (error, results) => {
    if (error) {
      console.error("Error readAllChallenges:", error);
      return res.status(500).json({ message: "Server error" });
    }
    res.status(200).json(results);
  };

  model.selectAll(callback);
};

//////////////////////////////////////////////////////
// CHECK CHALLENGE EXISTS
//////////////////////////////////////////////////////
module.exports.checkChallengeExists = (req, res, next) => {
  const data = { id: req.params.challenge_id };

  const callback = (error, results) => {
    if (error) {
      console.error("Error checkChallengeExists:", error);
      return res.status(500).json({ message: "Server error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    res.locals.challenge = results[0];
    next();
  };

  model.selectById(data, callback);
};

//////////////////////////////////////////////////////
// PUT /challenges/:challenge_id
//////////////////////////////////////////////////////
module.exports.checkChallengeExistsAndOwner = (req, res, next) => {
  const user_id = req.body.user_id;
  const description = req.body.description;
  const points = req.body.points;

  if (user_id === undefined || !description || points === undefined) {
    return res.status(400).json({ message: "Please fill in all the fields" });
  }

  const data = { id: req.params.challenge_id };

  const callback = (error, results) => {
    if (error) {
      console.error("Error checkChallengeExistsAndOwner:", error);
      return res.status(500).json({ message: "Server error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    const challenge = results[0];

    if (parseInt(challenge.creator_id) !== parseInt(user_id)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.locals.challenge_id = parseInt(req.params.challenge_id);
    res.locals.creator_id = challenge.creator_id;
    res.locals.description = description;
    res.locals.points = points;

    next();
  };

  model.selectById(data, callback);
};

module.exports.updateChallengeById = (req, res) => {
  const data = {
    challenge_id: res.locals.challenge_id,
    description: res.locals.description,
    points: res.locals.points,
  };

  const callback = (error, results) => {
    if (error) {
      console.error("Error updateChallengeById:", error);
      return res.status(500).json({ message: "Server error" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    res.status(200).json({
      challenge_id: res.locals.challenge_id,
      challenge: res.locals.description,
      creator_id: res.locals.creator_id,
      points: res.locals.points,
    });
  };

  model.updateById(data, callback);
};

//////////////////////////////////////////////////////
// DELETE /challenges/:challenge_id
//////////////////////////////////////////////////////
module.exports.checkChallengeExistsAndOwnerForDelete = (req, res, next) => {
  const user_id = req.body.user_id;

  if (user_id === undefined) {
    return res.status(400).json({ message: "Please fill in all the fields" });
  }

  const data = { id: req.params.challenge_id };

  const callback = (error, results) => {
    if (error) {
      console.error("Error checkChallengeExistsAndOwnerForDelete:", error);
      return res.status(500).json({ message: "Server error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    const challenge = results[0];

    if (parseInt(challenge.creator_id) !== parseInt(user_id)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };

  model.selectById(data, callback);
};

module.exports.deleteChallengeCompletions = (req, res, next) => {
  const data = { id: req.params.challenge_id };

  const callback = (error) => {
    if (error) {
      console.error("Error deleteChallengeCompletions:", error);
      return res.status(500).json({ message: "Server error" });
    }
    next();
  };

  model.deleteCompletionsByChallengeId(data, callback);
};

module.exports.deleteChallengeById = (req, res) => {
  const data = { id: req.params.challenge_id };

  const callback = (error, results) => {
    if (error) {
      console.error("Error deleteChallengeById:", error);
      return res.status(500).json({ message: "Server error" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    res.status(204).send();
  };

  model.deleteById(data, callback);
};

//////////////////////////////////////////////////////
// GET /challenges/:challenge_id
//////////////////////////////////////////////////////
module.exports.readUsersByChallengeId = (req, res) => {
  const data = { id: req.params.challenge_id };

  const callback = (error, results) => {
    if (error) {
      console.error("Error readUsersByChallengeId:", error);
      return res.status(500).json({ message: "Server error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "No attempts found" });
    }

    res.status(200).json(results);
  };

  model.selectUsersByChallengeId(data, callback);
};

//////////////////////////////////////////////////////
// POST /challenges/:challenge_id
//////////////////////////////////////////////////////
module.exports.validateCompletionBody = (req, res, next) => {
  const user_id = req.body.user_id;
  const details = req.body.details;

  if (user_id === undefined || !details) {
    return res.status(400).json({ message: "Please fill in all the fields" });
  }

  next();
};

module.exports.checkUserExists = (req, res, next) => {
  const data = { user_id: req.body.user_id };

  const callback = (error, results) => {
    if (error) {
      console.error("Error checkUserExists:", error);
      return res.status(500).json({ message: "Server error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    next();
  };

  model.selectUserById(data, callback);
};

module.exports.createCompletion = (req, res, next) => {
  const data = {
    challenge_id: req.params.challenge_id,
    user_id: req.body.user_id,
    details: req.body.details,
  };

  const callback = (error, results) => {
    if (error) {
      console.error("Error createCompletion:", error);
      return res.status(500).json({ message: "Server error" });
    }

    res.locals.completion_id = results.insertId;
    res.locals.completion = data;
    next();
  };

  model.insertCompletion(data, callback);
};

module.exports.rewardPointsToUser = (req, res, next) => {
  const challengePoints = res.locals.challenge.points;

  const data = {
    user_id: req.body.user_id,
    points_to_add: challengePoints,
  };

  const callback = (error) => {
    if (error) {
      console.error("Error rewardPointsToUser:", error);
      return res.status(500).json({ message: "Server error" });
    }
    next();
  };

  model.addPointsToUser(data, callback);
};

module.exports.respondCreatedCompletion = (req, res) => {
  res.status(201).json({
    completion_id: res.locals.completion_id,
    challenge_id: parseInt(res.locals.completion.challenge_id),
    user_id: parseInt(res.locals.completion.user_id),
    details: res.locals.completion.details,
  });
};
