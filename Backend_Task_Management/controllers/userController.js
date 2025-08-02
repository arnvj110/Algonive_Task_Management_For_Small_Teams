const User = require("../models/User");

const getTeamUsers = async (req, res) => {
  try {
    const users = await User.find({ team: req.team }).select('-password');
    res.json(users);
  } catch (error) {
    
    res.status(500).json({ message: 'Server error', error: error });
  }
};


const getCurrentUser = async (req, res) => {
  try {
    
    // Assuming authMiddleware sets req.user.userId
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    


    const user = await User.findById(userId).lean();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      name: user.username,
      email: user.email,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};


module.exports = {
  getTeamUsers,
  getCurrentUser,
  getUserById
}

