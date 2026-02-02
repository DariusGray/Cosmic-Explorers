const model = require("../models/challengeModel");

//////////////////////////////////////////////////////
// POST /challenges
//////////////////////////////////////////////////////
module.exports.createNewChallenge = (req, res, next) => {
  if (req.body.description === undefined || req.body.user_id === undefined || req.body.points === undefined) {
    return res.status(400).json({ message: "Error: Please fill in all the fields" });
  }

  const data = {
    description: req.body.description,
    user_id: req.body.user_id,
    points: req.body.points,
  };

  model.insertSingle(data, (error, results) => {
    if (error) {
      console.error("Error createNewChallenge:", error);
      return res.status(500).json({ message: "Internal Server error" });
    }

    res.locals.challenge_id = results.insertId;
    next();
  });
};

module.exports.readChallengeByIdAfterCreate = (req, res) => {
  const data = { id: res.locals.challenge_id };

  model.selectById(data, (error, results) => {
    if (error) {
      console.error("Error readChallengeByIdAfterCreate:", error);
      return res.status(500).json({ message: "Internal Server error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    const row = results[0];
    return res.status(201).json({
      challenge_id: row.challenge_id,
      challenge: row.description,
      creator_id: row.creator_id,
      points: row.points,
    });
  });
};

//////////////////////////////////////////////////////
// GET /challenges
//////////////////////////////////////////////////////
module.exports.readAllChallenges = (req, res) => {
  model.selectAll((error, results) => {
    if (error) {
      console.error("Error readAllChallenges:", error);
      return res.status(500).json({ message: "Internal Server error" });
    }
    return res.status(200).json(results);
  });
};

//////////////////////////////////////////////////////
// Middleware: challenge exists
//////////////////////////////////////////////////////
module.exports.checkChallengeExists = (req, res, next) => {
  const data = { id: req.params.challenge_id };

  model.selectById(data, (error, results) => {
    if (error) {
      console.error("Error checkChallengeExists:", error);
      return res.status(500).json({ message: "Internal Server error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    res.locals.challenge = results[0];
    next();
  });
};

//////////////////////////////////////////////////////
// PUT /challenges/:challenge_id owner check
//////////////////////////////////////////////////////
// PUT /challenges/:challenge_id owner check
module.exports.checkChallengeExistsAndOwner = (req, res, next) => {
  const incomingDescription =
    req.body.description !== undefined ? req.body.description : req.body.question;

  if (
    req.body.user_id === undefined ||
    incomingDescription === undefined ||
    req.body.points === undefined
  ) {
    return res.status(400).json({ message: "Please fill in all the fields" });
  }

  const data = { id: req.params.challenge_id };

  model.selectById(data, (error, results) => {
    if (error) {
      console.error("Error checkChallengeExistsAndOwner:", error);
      return res.status(500).json({ message: "Server error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    const challenge = results[0];

    if (parseInt(challenge.creator_id) !== parseInt(req.body.user_id)) {
      return res.status(403).json({ message: "Incorrect Owner!" });
    }

    res.locals.challenge_id = parseInt(req.params.challenge_id);
    res.locals.creator_id = challenge.creator_id;

    res.locals.description = incomingDescription;
    res.locals.points = req.body.points;

    next();
  });
};


module.exports.updateChallengeById = (req, res) => {
  const data = {
    challenge_id: res.locals.challenge_id,
    description: res.locals.description,
    points: res.locals.points,
  };

  model.updateById(data, (error, results) => {
    if (error) {
      console.error("Error updateChallengeById:", error);
      return res.status(500).json({ message: "Internal Server error" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    return res.status(200).json({
      challenge_id: res.locals.challenge_id,
      challenge: res.locals.description,
      creator_id: res.locals.creator_id,
      points: res.locals.points,
    });
  });
};

//////////////////////////////////////////////////////
// DELETE /challenges/:challenge_id
//////////////////////////////////////////////////////
module.exports.deleteChallengeCompletions = (req, res, next) => {
  const data = { id: req.params.challenge_id };

  model.deleteCompletionsByChallengeId(data, (error) => {
    if (error) {
      console.error("Error deleteChallengeCompletions:", error);
      return res.status(500).json({ message: "Internal Server error" });
    }
    next();
  });
};

module.exports.deleteChallengeById = (req, res) => {
  const data = { id: req.params.challenge_id };

  model.deleteById(data, (error, results) => {
    if (error) {
      console.error("Error deleteChallengeById:", error);
      return res.status(500).json({ message: "Internal Server error" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    return res.status(204).send();
  });
};

//////////////////////////////////////////////////////
// DELETE /challenges/:challenge_id owner check
//////////////////////////////////////////////////////
module.exports.checkChallengeExistsAndOwnerForDelete = (req, res, next) => {
  if (req.body.user_id === undefined) {
    return res.status(400).json({ message: "user_id is required" });
  }

  const data = { id: req.params.challenge_id };

  model.selectById(data, (error, results) => {
    if (error) {
      console.error("Error checkChallengeExistsAndOwnerForDelete:", error);
      return res.status(500).json({ message: "Internal Server error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    const challenge = results[0];

    if (parseInt(challenge.creator_id) !== parseInt(req.body.user_id)) {
      return res.status(403).json({ message: "Incorrect Owner!" });
    }

    next();
  });
};


//////////////////////////////////////////////////////
// GET /challenges/:challenge_id
//////////////////////////////////////////////////////
module.exports.readUsersByChallengeId = (req, res) => {
  const data = { id: req.params.challenge_id };

  model.selectUsersByChallengeId(data, (error, results) => {
    if (error) {
      console.error("Error readUsersByChallengeId:", error);
      return res.status(500).json({ message: "Internal Server error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "The challenge does not have any user attempts" });
    }

    return res.status(200).json(results);
  });
};

//////////////////////////////////////////////////////
// POST /challenges/:challenge_id completion
//////////////////////////////////////////////////////
module.exports.validateCompletionBody = (req, res, next) => {
  if (req.body.user_id === undefined || req.body.details === undefined) {
    return res.status(400).json({ message: "Error: Please provide user_id and details" });
  }
  next();
};

module.exports.checkUserExists = (req, res, next) => {
  const data = { user_id: req.body.user_id };

  model.selectUserById(data, (error, results) => {
    if (error) {
      console.error("Error checkUserExists:", error);
      return res.status(500).json({ message: "Internal Server error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    next();
  });
};

module.exports.createCompletion = (req, res, next) => {
  const data = {
    challenge_id: req.params.challenge_id,
    user_id: req.body.user_id,
    details: req.body.details,
  };

  model.insertCompletion(data, (error, results) => {
    if (error) {
      console.error("Error createCompletion:", error);
      return res.status(500).json({ message: "Internal Server error" });
    }

    res.locals.completion_id = results.insertId;
    res.locals.completion = data;
    next();
  });
};

module.exports.rewardPointsToUser = (req, res, next) => {
  const challengePoints = res.locals.challenge.points;

  const data = {
    user_id: req.body.user_id,
    points_to_add: challengePoints,
  };

  model.addPointsToUser(data, (error) => {
    if (error) {
      console.error("Error rewardPointsToUser:", error);
      return res.status(500).json({ message: "Internal Server error" });
    }
    next();
  });
};

module.exports.respondCreatedCompletion = (req, res) => {
  return res.status(201).json({
    completion_id: res.locals.completion_id,
    challenge_id: parseInt(res.locals.completion.challenge_id),
    user_id: parseInt(res.locals.completion.user_id),
    details: res.locals.completion.details,
  });
};
