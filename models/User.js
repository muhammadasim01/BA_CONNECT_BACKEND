const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});
userSchema.methods.generateToken = async function () {
  const token = jwt.sign(
    { id: this._id, name: this.name },
    process.env.TOKEN_SECRET_KEY,
    { expiresIn: "20h" }
  );
  this.tokens = this.tokens.concat({ token });
  await this.save();

  return token;
};
const User = mongoose.model("User", userSchema);
module.exports = User;
