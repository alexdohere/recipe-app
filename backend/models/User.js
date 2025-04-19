const { db } = require("../config/db");

const bcrypt = require("bcrypt");

const createUser = async (user) => {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  return db("users")
    .insert({ email: user.email, password: hashedPassword, name: user.name })
    .returning("*");
};

const findUserByEmail = async (email) => {
  return db("users").where({ email }).first();
};

module.exports = {
  createUser,
  findUserByEmail,
};
