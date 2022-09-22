const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.send({
      success: false,
      message: "please provide all the fields",
    });
  const isExist = await User.findOne({ email });
  if (isExist)
    return res.send({
      success: false,
      message: "user already exist",
    });

  const newUser = await new User({ name, email, password }).save();
  res.send({ succes: true, message: "user sign in successfully" });
};
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  if (!email || !password)
    return res.send({ success: false, message: "please fill all the fields" });
  const isExist = await User.findOne({ email });
  if (isExist) {
    console.log("isexist");
    const isMatch = await bcrypt.compare(password, isExist.password);
    if (isMatch) {
      console.log("isMatch");
      const token = await isExist.generateToken();
      console.log(token);
      if (token)
        return res.send({
          success: true,
          message: "user signed in successfully",
          token,
        });
    }
  }
};
module.exports = { registerUser, loginUser };
