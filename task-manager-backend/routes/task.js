const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const { authMiddleware } = require('../middlewares/auth');

const Task = require('../models/Task');
const User = require('../models/User');

const {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask
} = require('../controllers/taskController');

// Routes
router.post('/', authMiddleware, upload.array('documents', 3), createTask);
router.get('/', authMiddleware, getAllTasks);
router.get('/:id', authMiddleware, getTaskById);
router.put('/:id', authMiddleware, upload.array('documents', 3), updateTask);
router.delete('/:id', authMiddleware, deleteTask);

// ✅ Assign Task to User
router.put('/:id/assign', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { assignedTo: userId },
      { new: true, runValidators: true }
    ).populate('assignedTo', 'email');

    if (!task) return res.status(404).json({ error: 'Task not found' });

    res.json({ message: 'Task assigned successfully', task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ Update Task Status (for assigned users)
router.put('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: 'Status is required' });

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!task) return res.status(404).json({ error: 'Task not found' });

    res.json({ message: 'Status updated', task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
