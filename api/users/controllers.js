const User = require("../../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRETKEY, JWT_EXP } = require("../../config/keys");
exports.signUp = async (req, res, next) => {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    req.body.password = hashedPassword;
    const newUser = await User.create(req.body);
    let payload = {
      username: newUser.username,
      id: newUser.id,
      exp: Date.now() + JWT_EXP,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
    };
    const token = jwt.sign(payload, JWT_SECRETKEY);
    res.status(201).json({
      token: token,
    });
  } catch (error) {
    next(error);
  }
};
