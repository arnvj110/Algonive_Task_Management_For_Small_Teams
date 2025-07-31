const Team = require("../models/Team");
const User = require("../models/User");
const Notification = require("../models/Notification");

// Create a new team
// Create a new team
exports.createTeam = async (req, res) => {
    try {
        console.log(req.body);
        const { name } = req.body;


        // Check if team already exists
        const existingTeam = await Team.findOne({ name });
        if (existingTeam) {
            return res.status(400).json({ error: "Team name already exists" });
        }

        // Prevent duplicate team membership or ownership
        const currentUser = await User.findById(req.user.userId);
        if (currentUser.team) {
            return res.status(400).json({ error: "You are already part of a team. Leave it before creating a new one." });
        }

        const ownedTeam = await Team.findOne({ owner: req.user.userId });
        if (ownedTeam) {
            return res.status(400).json({ error: "You already own a team." });
        }

        const team = await Team.create({
            name,
            owner: req.user.userId,
            members: [req.user.userId],
        });

        await User.findByIdAndUpdate(req.user.userId, { team: team._id });

        // Notify creator
        await Notification.create({
            user: req.user.userId,
            message: `You created the team "${name}".`,
            type: "team_created",
        });

        res.status(201).json(team);
    } catch (error) {
        res.status(500).json({ error: "Server error", error: error.message });
    }
};


// Get current user's team details
exports.getMyTeam = async (req, res) => {
    try {
        const team = await Team.findOne({ members: req.user.userId })
            .populate("members", "username email")
            .populate("owner", "username");

        if (!team) return res.status(404).json({ error: "Team not found" });

        res.json({ team });
    } catch (error) {
        res.status(500).json({ error: "Server error", error: error.message });
    }
};

// Invite a user to the team
exports.inviteToTeam = async (req, res) => {
    try {
        const { email } = req.body;
        
        const team = await Team.findOne({ owner: req.user.userId });

        if (!team) return res.status(403).json({ error: "You don't own a team!" });

        if (team.members.length >= 5) {
            return res.status(400).json({ error: "Team already has maximum 5 members!" });
        }

        const alreadyInvited = team.pendingInvites.find(inv => inv.email === email);
        if (alreadyInvited) {
            return res.status(400).json({ error: "Invitation already sent!" });
        }

        team.pendingInvites.push({ email, invitedBy: req.user.userId });
        await team.save();

        // Notify inviter
        const notifications = [
            {
                user: req.user.userId,
                message: `You invited ${email} to join your team "${team.name}".`,
                type: "invite_sent",
            },
        ];

        // Check if invited user already exists (has an account)
        const invitedUser = await User.findOne({ email });
        if (invitedUser) {
            notifications.push({
                user: invitedUser._id,
                message: `You have been invited to join the team "${team.name}".`,
                type: "invite_received",
            });
        }

        await Notification.insertMany(notifications);
        
        res.status(200).json({ message: "Invitation sent!" });
    } catch (error) {
        
        res.status(500).json({ error: "Server error", error: error.message });
    }
};


// Join a team (based on invite)
// Join a specific team by ID
exports.joinTeam = async (req, res) => {
  try {
    const user = req.user;
    const { teamId } = req.body;

    if (!teamId) return res.status(400).json({ error: "Team ID is required" });

    if (user.team) {
      return res.status(400).json({ error: "You are already part of a team" });
    }

    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ error: "Team not found" });

    // Check if user is actually invited to this team
    const isInvited = team.pendingInvites.some(invite => invite.email === user.email);
    if (!isInvited) {
      return res.status(403).json({ error: "You are not invited to this team" });
    }

    if (team.members.length >= 5) {
      return res.status(400).json({ error: "Team already has maximum 5 members" });
    }

    // Join this team
    team.members.push(user.userId);
    team.pendingInvites = team.pendingInvites.filter(inv => inv.email !== user.email);

    // Remove this user from pendingInvites of all other teams
    await Team.updateMany(
      {
        "pendingInvites.email": user.email,
        _id: { $ne: team._id }
      },
      {
        $pull: { pendingInvites: { email: user.email } }
      }
    );

    // Save team and update user
    await Promise.all([
      team.save(),
      User.findByIdAndUpdate(user.userId, { team: team._id })
    ]);

    await Notification.create({
      user: user.userId,
      message: `You joined the team "${team.name}".`,
      type: "joined_team",
    });
    
    // Notify other members
    const notifyOthers = team.members
      .filter(id => String(id) !== String(user.userId))
      .map(id => ({
        user: id,
        message: `${user.username} joined your team "${team.name}".`,
        type: "member_joined",
      }));

    await Notification.insertMany(notifyOthers);

    res.status(200).json({ message: "Joined team successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error", error: error.message });
  }
};

// Leave a team
exports.leaveTeam = async (req, res) => {
    try {
        const user = req.user;

        const team = await Team.findOne({ members: user.userId });
        if (!team) return res.status(404).json({ error: "Team not found" });

        if (String(team.owner) === String(user.userId)) {
            return res.status(403).json({ error: "Owner cannot leave the team directly" });
        }

        team.members = team.members.filter(
            (memberId) => String(memberId) !== String(user.userId)
        );
        await team.save();

        await User.findByIdAndUpdate(user.userId, { $unset: { team: "" } });

        // Notify leaver
        await Notification.create({
            user: user.userId,
            message: `You left the team "${team.name}".`,
            type: "left_team",
        });

        // Notify remaining team
        const notifyTeam = team.members.map(id => ({
            user: id,
            message: `${user.username} left your team "${team.name}".`,
            type: "member_left",
        }));

        await Notification.insertMany(notifyTeam);

        res.status(200).json({ message: "Left team successfully" });
    } catch (error) {
        res.status(500).json({ error: "Server error", error: error.message });
    }
};

exports.getMyInvites = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        const teams = await Team.find({ "pendingInvites.email": user.email }).select("name");

        res.json({ invites: teams.map(t => ({ teamId: t._id, name: t.name })) });
    } catch (err) {
        res.status(500).json({ error: "Server error", error: err.message });
    }
};

// GET /api/team/invites
exports.getPendingInvites = async (req, res) => {
    try {
        const teams = await Team.find({ "pendingInvites.email": req.user.email })
            .select("name owner")
            .populate("owner", "username");

        res.status(200).json({ invites: teams });
    } catch (error) {
        res.status(500).json({ error: "Server error", detail: error.message });
    }
};

// Reject an invitation to a team
exports.rejectInvite = async (req, res) => {
  try {
    const user = req.user;
    const { teamId } = req.body;

    if (!teamId) return res.status(400).json({ error: "Team ID is required" });

    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ error: "Team not found" });

    const wasInvited = team.pendingInvites.some(inv => inv.email === user.email);
    if (!wasInvited) return res.status(400).json({ error: "You were not invited to this team" });

    // Remove the invitation
    team.pendingInvites = team.pendingInvites.filter(inv => inv.email !== user.email);
    await team.save();

    // Notify inviter (optional)
    const inviter = team.pendingInvites.find(inv => inv.email === user.email)?.invitedBy;
    if (inviter) {
      await Notification.create({
        user: inviter,
        message: `${user.username} rejected your invitation to team "${team.name}".`,
        type: "invite_rejected",
      });
    }

    // Notify rejector
    await Notification.create({
      user: user.userId,
      message: `You rejected the invite to team "${team.name}".`,
      type: "invite_rejected",
    });

    res.status(200).json({ message: "Invite rejected successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error", detail: error.message });
  }
};
