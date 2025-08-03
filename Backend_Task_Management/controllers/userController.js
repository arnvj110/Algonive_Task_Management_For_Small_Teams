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
    const userId = req.user.userId; // From auth middleware

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update fields
    user.username = username || user.username;
    user.email = email || user.email;

    const updatedUser = await user.save();
    
    res.status(200).json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      // Include other fields you want to return
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

const deleteCurrentUser = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // 1. Get the user first to check team ownership
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Handle team ownership transfer or deletion
    if (user.team) {
      const team = await Team.findOne({ _id: user.team });
      
      if (team) {
        // If user is the owner, we need special handling
        if (String(team.owner) === String(userId)) {
          // Option 1: Delete the team if no other members
          if (team.members.length === 1) {
            await Team.findByIdAndDelete(team._id);
          } 
          // Option 2: Transfer ownership to another member
          else {
            const newOwner = team.members.find(memberId => String(memberId) !== String(userId));
            team.owner = newOwner;
            await team.save();
            
            // Notify new owner
            await Notification.create({
              user: newOwner,
              message: `You are now the owner of team "${team.name}" as the previous owner left.`,
              type: "team_ownership_transferred"
            });
          }
        }
        
        // Remove user from team members
        team.members = team.members.filter(memberId => String(memberId) !== String(userId));
        await team.save();
      }
    }

    // 3. Handle tasks (multiple approaches possible)
    // Option A: Reassign tasks to other team members
    const userTasks = await Task.find({ 
      $or: [
        { createdBy: userId },
        { assignedTo: userId }
      ]
    });

    for (const task of userTasks) {
      // For assigned tasks, reassign to team owner or unassign
      if (String(task.assignedTo) === String(userId)) {
        if (user.team) {
          const team = await Team.findById(user.team);
          if (team) {
            // Reassign to team owner or another member
            const newAssignee = team.owner || team.members[0];
            task.assignedTo = newAssignee;
            await task.save();
            
            // Notify new assignee
            await Notification.create({
              user: newAssignee,
              task: task._id,
              message: `Task "${task.title}" was reassigned to you as the previous assignee left the team.`,
              type: "task_reassigned"
            });
          }
        } else {
          // If no team, just unassign
          task.assignedTo = null;
          await task.save();
        }
      }
      
      // For tasks created by user, change creator to "Deleted User" or similar
      if (String(task.createdBy) === String(userId)) {
        task.createdBy = null; // or set to a system user
        await task.save();
      }
    }

    // Option B: Delete all user's tasks (alternative approach)
    // await Task.deleteMany({
    //   $or: [
    //     { createdBy: userId },
    //     { assignedTo: userId }
    //   ]
    // });

    // 4. Delete all notifications related to the user
    await Notification.deleteMany({
      $or: [
        { user: userId }, // Notifications to the user
        { 'data.relatedUser': userId } // Notifications about the user
      ]
    });

    // 5. Remove any pending invites
    await Team.updateMany(
      { "pendingInvites.email": user.email },
      { $pull: { pendingInvites: { email: user.email } } }
    );

    // 6. Finally delete the user
    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: "User and all related data deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Update your exports to include the new functions
module.exports = {
  getTeamUsers,
  getCurrentUser,
  getUserById,
  updateCurrentUser,
  deleteCurrentUser
};