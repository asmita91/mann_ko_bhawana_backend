const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const counselorSchema = new mongoose.Schema({
  counselorName: {
    type: String,
    required: true,
    trim: true,
  },
  counselorPosition: {
    type: String,
    required: true,
    trim: true,
  },
  counselorDescription: {
    type: String,
    required: true,
    trim: true,
  },
  expertise: {
    type: String,
    required: true,
    trim: true,
  },
  approach: {
    type: String,
    required: true,
    trim: true,
  },
  philosophy: {
    type: String,
    required: true,
    trim: true,
  },
  educationalDegree: {
    type: String,
    required: true,
    trim: true,
  },
  counselorImageUrl: {
    type: String,
    required: true,
  },
  counselorCode: {
    type: Number,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    default: "password",
  },
  role: {
    type: String,
    enum: ["counselor"],
    default: "counselor",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

// Hash password before saving
counselorSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

counselorSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",  // Provide default value if not set
  });
};

counselorSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const Counselors = mongoose.model("Counselors", counselorSchema);

module.exports = Counselors;
