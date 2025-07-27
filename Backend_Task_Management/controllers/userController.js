const User = require("../models/User");

exports.getTeamUsers = async (req, res) => {
  try {
    const users = await User.find({ team: req.team }).select('-password');
    res.json(users);
  } catch (error) {
    
    res.status(500).json({ message: 'Server error', error: error });
  }
};