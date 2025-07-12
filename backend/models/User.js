// backend/models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
    default: "https://i.imgur.com/placeholder.png"
  },
  skillsOffered: [String],
  skillsWanted: [String],
  availability: [String],
  isPublic: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
