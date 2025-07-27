const Task = require("../models/Task");
const Notification = require("../models/Notification");

// Create Task + Notify
exports.createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, dueDate, priority, subtasks } = req.body;

    const task = await Task.create({
      title,
      description,
      assignedTo,
      dueDate,
      priority,
      subtasks,
      createdBy: req.user.userId,
      team: req.team,
    });

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
    
    res.status(500).json({ msg: "Server error", error : err });
  }
};

// Get tasks assigned to the logged-in user
exports.getAssignedTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user });
    res.json(tasks);
  } catch (err) {
    
    res.status(500).json({ msg: "Server error", error : err });
  }
};

// Get all tasks for the user's team
exports.getTeamTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ team: req.team });
    res.json(tasks);
  } catch (err) {
    
    res.status(500).json({ msg: "Server error", error: err });
  }
};

// Update task details or status
exports.updateTask = async (req, res) => {
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

// Optionally add deleteTask if used in your routes
exports.deleteTask = async (req, res) => {
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
