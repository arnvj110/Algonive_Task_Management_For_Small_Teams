const express = require('express');
const router = express.Router();

const {
  createTask,
  getAssignedTasks,
  getTeamTasks,
  deleteTask,
  updateTask
} = require('../controllers/taskController');
const authMiddleware = require('../middlewares/authMiddleware');


router.use(authMiddleware)
// Create a new task
router.post('/create', createTask);

// Get tasks assigned to the logged-in user
router.get('/my-tasks', getAssignedTasks);

// Get all tasks for the user's team
router.get('/team-tasks', getTeamTasks);

// Delete a task
router.delete('/:id', deleteTask);

router.put('/:id', updateTask);

module.exports = router;
