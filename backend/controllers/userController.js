// backend/controllers/userController.js
const User = require("../models/User");

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const { name, profileImage, skillsOffered, skillsWanted, availability, isPublic } = req.body;
    const user = await User.findById(req.userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name || user.name;
    user.profileImage = profileImage || user.profileImage;
    user.skillsOffered = skillsOffered || user.skillsOffered;
    user.skillsWanted = skillsWanted || user.skillsWanted;
    user.availability = availability || user.availability;
    user.isPublic = isPublic !== undefined ? isPublic : user.isPublic;

    const updated = await user.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
