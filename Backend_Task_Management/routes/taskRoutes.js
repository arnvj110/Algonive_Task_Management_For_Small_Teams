const express = require('express');
const router = express.Router();

const {
  createTask,
  getAssignedTasks,
  getTeamTasks,
  deleteTask
} = require('../controllers/taskController');
const authMiddleware = require('../middlewares/authMiddleware');



// Create a new task
router.post('/create', authMiddleware, createTask);

// Get tasks assigned to the logged-in user
router.get('/my-tasks', authMiddleware, getAssignedTasks);

// Get all tasks for the user's team
router.get('/team-tasks', authMiddleware, getTeamTasks);

// Delete a task
router.delete('/:id', authMiddleware, deleteTask);

module.exports = router;
