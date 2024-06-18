const mongoose = require("mongoose");
const Joi = require("joi");
const crypto = require("crypto");
const userSchema = new mongoose.Schema({
userName:{
  type:String,
  required:true,
},
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  userImageUrl: {
    type: String,
    required: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },

  resetPasswordToken: String,
  resetPasswordExpire: Date,
});


userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
    //expiresIn: 5,
  });
};

userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  console.log(resetToken);

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  console.log(this.resetPasswordToken);
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};
const User = mongoose.model("users", userSchema);

module.exports = { User };
