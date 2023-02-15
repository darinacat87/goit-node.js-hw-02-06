const { Contact } = require("../../models");
const add = async (req, res, next) => {
  const { _id } = req.user;
  const result = await Contact.create({ ...req.body, owner: _id });

  res.status(201).json(result);
};
module.exports = add;
