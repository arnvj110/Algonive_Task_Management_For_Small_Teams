const Task = require("../models/Task");
const Notification = require("../models/Notification");

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
    const tasks = await Task.find({ team: req.user.team });
    res.json(tasks);
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

    res.json(task);
  } catch (err) {
    
    res.status(500).json({ msg: "Server error", error: err });
  }
};

// deleteTask
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id });

    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    res.json({ msg: "Task deleted successfully" });
  } catch (err) {
    
    res.status(500).json({ msg: "Server error", error: err });
  }
};

module.exports = {
  createTask,
  getAssignedTasks,
  getTeamTasks,
  updateTask,
  deleteTask
}