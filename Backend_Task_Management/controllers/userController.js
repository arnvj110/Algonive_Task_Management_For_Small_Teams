const Team = require("../models/Team");
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

const updateCurrentUser = async (req, res) => {
  try {
    const { username, email } = req.body;
    const userId = req.user.userId; 

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    
    user.username = username || user.username;
    user.email = email || user.email;

    const updatedUser = await user.save();
    
    res.status(200).json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

const deleteCurrentUser = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    
    if (user.team) {
      const team = await Team.findOne({ _id: user.team });
      
      if (team) {
        
        if (String(team.owner) === String(userId)) {
          
          if (team.members.length === 1) {
            await Team.findByIdAndDelete(team._id);
          } 
          
          else {
            const newOwner = team.members.find(memberId => String(memberId) !== String(userId));
            team.owner = newOwner;
            await team.save();
            
            
            await Notification.create({
              user: newOwner,
              message: `You are now the owner of team "${team.name}" as the previous owner left.`,
              type: "team_ownership_transferred"
            });
          }
        }
        
        
        team.members = team.members.filter(memberId => String(memberId) !== String(userId));
        await team.save();
      }
    }

    

    
    await Task.deleteMany({
      $or: [
        { createdBy: userId },
        { assignedTo: userId }
      ]
    });

    
    await Notification.deleteMany({
      $or: [
        { user: userId }, 
        { 'data.relatedUser': userId } 
      ]
    });

    
    await Team.updateMany(
      { "pendingInvites.email": user.email },
      { $pull: { pendingInvites: { email: user.email } } }
    );

    
    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: "User and all related data deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};


module.exports = {
  getTeamUsers,
  getCurrentUser,
  getUserById,
  updateCurrentUser,
  deleteCurrentUser
};