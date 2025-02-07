const { verify } = require("../helpers/token");
const User = require("../models/User");

module.exports = async function (req, res, next) {
  if (!req.cookies.token) {
    res.send({ error: "This action is only available to authorized users." });
    return;
  }
  const tokenData = verify(req.cookies.token);
  const user = await User.findOne({ _id: tokenData.id });

  if (!user) {
    res.send({ error: "This action is only available to authorized users." });
    return;
  }

  req.user = user;

  next();
};
