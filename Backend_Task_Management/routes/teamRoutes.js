const express = require("express");
const router = express.Router();
const { createTeam, getMyTeam, inviteToTeam, joinTeam, leaveTeam, getMyInvites, getPendingInvites } = require("../controllers/teamController");

const authMiddleware = require("../middlewares/authMiddleware");

router.use(authMiddleware);
// Create a team
router.post("/create", createTeam);

// Get current user's team info
router.get("/my", getMyTeam);

// Invite a user to the team
router.post("/invite", inviteToTeam);

// Join a team using invite
router.post("/join", joinTeam);

// Leave the current team
router.post("/leave", leaveTeam);

// Get pending invitations for current user (by email)
router.get("/invites", getMyInvites);

router.get("/pendingInvites", getPendingInvites);


module.exports = router;
