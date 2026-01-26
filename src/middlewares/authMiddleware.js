//////////////////////////////////////////////////////
// AUTHORIZATION HELPERS
// Enforces that the authenticated user matches request user_id.
//////////////////////////////////////////////////////

module.exports.requireSameUserParam = (req, res, next) => {
  const paramUserId = parseInt(req.params.user_id);
  const tokenUserId = parseInt(res.locals.userId);

  if (isNaN(paramUserId) || isNaN(tokenUserId)) {
    return res.status(400).json({ message: "Invalid user_id" });
  }

  if (paramUserId !== tokenUserId) {
    return res.status(403).json({ message: "Forbidden: user mismatch" });
  }

  next();
};

module.exports.requireSameUserBody = (req, res, next) => {
  if (!req.body || req.body.user_id === undefined) {
    return res.status(400).json({ message: "user_id is required in request body" });
  }

  const bodyUserId = parseInt(req.body.user_id);
  const tokenUserId = parseInt(res.locals.userId);

  if (isNaN(bodyUserId) || isNaN(tokenUserId)) {
    return res.status(400).json({ message: "Invalid user_id" });
  }

  if (bodyUserId !== tokenUserId) {
    return res.status(403).json({ message: "Forbidden: user mismatch" });
  }

  next();
};
