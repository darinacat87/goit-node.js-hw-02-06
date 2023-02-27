const { User } = require("../../models/index");
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");

const avatarsDir = path.join(__dirname, "../../", "public", "avatars");

const updateAvatar = async (req, res) => {
  const { path: teamUpload, originalname } = req.file;
  const file = await Jimp.read(teamUpload);
  await file.resize(250, 250).write(teamUpload);
  const { _id: id } = req.user;
  try {
    const resultUpload = path.join(avatarsDir, `${id}_${originalname}`);
    await fs.rename(teamUpload, resultUpload);
    const avatarUrl = `/avatars/${id}_${originalname}`;
    await User.findByIdAndUpdate(req.user._id, { avatarUrl });
    res.json({ avatarUrl });
  } catch {
    await fs.unlink(teamUpload);
    throw Error;
  }
};

module.exports = updateAvatar;
