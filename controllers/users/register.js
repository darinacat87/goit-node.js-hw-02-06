const { User } = require("../../models");
const { Conflict } = require("http-errors");
const gravatar = require("gravatar");
const sendEmail = require("../../helpers/index");
const { v4: uuidv4 } = require("uuid");

const register = async (req, res) => {
  const { email, password, subscription } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw new Conflict("Email in use");
  }
  const avatarURL = gravatar.url(email);
  const verificationToken = uuidv4();
  const newUser = new User({
    email,
    subscription,
    avatarURL,
    verificationToken,
  });
  const mailData = {
    to: email,
    subject: "Підтвердіть реєстрацію на сайті",
    html: `<a href= "http://localhost:3000/api/users/verify/${verificationToken}" target="_blank">Нажміть для підтвердження email</a>`,
  };
  sendEmail(mailData);
  newUser.setPassword(password);
  newUser.save();
  res.status(201).json({
    email,
    subscription: newUser.subscription,
    avatarURL,
  });
};

module.exports = register;
