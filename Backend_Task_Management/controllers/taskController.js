const Task = require("../models/Task");
const Notification = require("../models/Notification");
const User = require("../models/User");

// Create Task + Notify
const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      assignedTo,
      status,
      dueDate,
      priority,
      subtasks,
      team
    } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Task title is required." });
    }

    const task = await Task.create({
      title,
      description,
      assignedTo,
      dueDate,
      status,
      priority,
      subtasks,
      createdBy: req.user.userId,
      team: team,
    });

    // Create a notification for the assigned user
    if (assignedTo) {
      await Notification.create({
        user: assignedTo,
        task: task._id,
        type: "assignment",
        message: `You've been assigned a task: "${title}"`,
      });
    }

    res.status(201).json(task);
  } catch (err) {
    console.error("Error creating task:", err);
    res.status(500).json({ error: "Something went wrong while creating the task." });
  }
};


// Get tasks assigned to the logged-in user
const getAssignedTasks = async (req, res) => {

  try {
    // Extract the user ID (adjust to your auth middleware's user object)
    const userId = req.user.userId || req.user._id;

    const tasks = await Task.find({ assignedTo: userId });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err });
  }
};


// Get all tasks for the user's team
const getTeamTasks = async (req, res) => {

  try {
    const userTeam = await User.findById(req.user.userId);


    const tasks = await Task.find({ team: userTeam.team });

    res.status(200).json(tasks);
  } catch (err) {

    res.status(500).json({ msg: "Server error", error: err });
  }
};

// Update task details or status
const updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    // 🔔 Send notification after status update
    if (req.body.status) {
      const assignedTo = task.assignedTo?.toString();
      const createdBy = task.createdBy?.toString();
      const statusLabel = req.body.status.charAt(0).toUpperCase() + req.body.status.slice(1);
      const message = `Task "${task.title}" status updated to "${statusLabel}".`;

      if (assignedTo === createdBy) {
        await Notification.create({
          user: assignedTo,
          task: task._id,
          type: "statusUpdate",
          message,
        });
      } else {
        await Notification.create({
          user: assignedTo,
          task: task._id,
          type: "statusUpdate",
          message,
        });

        await Notification.create({
          user: createdBy,
          task: task._id,
          type: "statusUpdate",
          message,
        });
      }
    }

    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err });
  }
};


// deleteTask
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    // Check if the user deleting the task is the creator
    if (task.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ msg: "You are not authorized to delete this task" });
    }

    // Delete the task
    await Task.findByIdAndDelete(req.params.id);

    // Prepare notification message
    const message = `The task "${task.title}" has been deleted.`;

    // Send notification to assigned user and creator (avoid duplicate if same)
    const notifiedUsers = new Set();

    // Notify assignedTo
    if (task.assignedTo && task.assignedTo.toString() !== req.user.userId) {
      await Notification.create({
        user: task.assignedTo,
        task: task._id,
        type: "task_deleted",
        message,
      });
      notifiedUsers.add(task.assignedTo.toString());
    }

    // Notify creator
    if (!notifiedUsers.has(task.createdBy.toString())) {
      await Notification.create({
        user: task.createdBy,
        task: task._id,
        type: "task_deleted",
        message,
      });
    }

    res.status(200).json({ msg: "Task deleted successfully" });

  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};




module.exports = {
  createTask,
  getAssignedTasks,
  getTeamTasks,
  updateTask,
  deleteTask,

}