const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema({
  issueName: {
    type: String,
    required: true,
    trim: true,
  },
  issueDescription: {
    type: String,
    required: true,
    trim: true,
  },
  issueQuestion: {
    type: String,
    required: true,
    trim: true,
  },
  whatIsIt: {
    type: String,
    required: true,
    trim: true,
  },
  stat: {
    type: String, 
    required: true,
    trim: true,
  },
  youtubeUrl: {
    type: String,
    required: true,
    trim: true,
  },

  issueImageUrl: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Issue = mongoose.model("Issue", issueSchema);
module.exports = Issue;
