//////////////////////////////////////////////////////
// CHECK USER ID (PARAM)
//////////////////////////////////////////////////////
module.exports.requireSameUserParam = (req, res, next) => {
  const paramUserId = parseInt(req.params.user_id);
  const tokenUserId = parseInt(res.locals.userId);

  if (isNaN(paramUserId) || isNaN(tokenUserId)) {
    return res.status(400).json({ message: "Invalid user id" });
  }

  if (paramUserId !== tokenUserId) {
    return res.status(403).json({ message: "Forbidden: Wrong Token or User Id" });
  }

  next();
};

//////////////////////////////////////////////////////
// CHECK USER ID (BODY)
//////////////////////////////////////////////////////
module.exports.requireSameUserBody = (req, res, next) => {
  const bodyUserId = parseInt(req.body.user_id);
  const tokenUserId = parseInt(res.locals.userId);

  if (isNaN(bodyUserId) || isNaN(tokenUserId)) {
    return res.status(400).json({ message: "Invalid user id" });
  }

  if (bodyUserId !== tokenUserId) {
    return res.status(403).json({ message: "Forbidden: Wrong Token or User Id" });
  }

  next();
};
