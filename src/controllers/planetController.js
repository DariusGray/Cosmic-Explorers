const model = require("../models/planetModel");

module.exports.getAllPlanets = (req, res) => {
  model.selectAllPlanets({}, (error, results) => {
    if (error) return res.status(500).json(error);
    return res.status(200).json(results);
  });
};

module.exports.checkUserExists = (req, res, next) => {
  const data = { user_id: req.params.user_id };

  model.selectUserById(data, (error, results) => {
    if (error) return res.status(500).json(error);

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.locals.user = {
      user_id: results[0].user_id,
      points: results[0].points,
      latest_discovered_planet: results[0].latest_discovered_planet,
    };

    next();
  });
};

module.exports.unlockPlanets = (req, res, next) => {
  const data = { points: res.locals.user.points };

  model.selectEligiblePlanets(data, (error, results) => {
    if (error) return res.status(500).json(error);

    let unlocked = [];
    let remaining = results.length;

    if (remaining === 0) {
      res.locals.unlocked = [];
      return next();
    }

    for (let i = 0; i < results.length; i++) {
      const insertData = {
        user_id: res.locals.user.user_id,
        planet_id: results[i].planet_id,
        name: results[i].name,
        unlock_points: results[i].unlock_points,
      };

      model.insertUserPlanet(insertData, (err, result) => {
        if (err) return res.status(500).json(err);

        if (result.affectedRows > 0) {
          unlocked.push({
            planet_id: insertData.planet_id,
            name: insertData.name,
            unlock_points: insertData.unlock_points,
          });
        }

        remaining--;
        if (remaining === 0) {
          res.locals.unlocked = unlocked;
          next();
        }
      });
    }
  });
};

module.exports.updateLatestDiscoveredPlanet = (req, res, next) => {
  if (!res.locals.unlocked || res.locals.unlocked.length === 0) {
    return next();
  }

  let latest = res.locals.unlocked[0];
  for (let i = 1; i < res.locals.unlocked.length; i++) {
    if (res.locals.unlocked[i].unlock_points > latest.unlock_points) {
      latest = res.locals.unlocked[i];
    }
  }

  const data = {
    user_id: res.locals.user.user_id,
    planet_name: latest.name,
  };

  model.updateUserLatestPlanet(data, (error) => {
    if (error) return res.status(500).json(error);

    res.locals.user.latest_discovered_planet = latest.name;
    next();
  });
};

module.exports.respondUnlockedPlanets = (req, res) => {
  return res.status(200).json({
    user_id: parseInt(req.params.user_id),
    points: res.locals.user.points,
    latest_discovered_planet: res.locals.user.latest_discovered_planet,
    newly_unlocked: res.locals.unlocked,
  });
};

module.exports.getPlanetsByUser = (req, res) => {
  const data = { user_id: req.params.user_id };

  model.selectUserPlanets(data, (error, results) => {
    if (error) return res.status(500).json(error);
    return res.status(200).json(results);
  });
};
