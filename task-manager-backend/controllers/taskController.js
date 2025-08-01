const Task = require('../models/Task');
const path = require('path');

// CREATE TASK
exports.createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, assignedTo } = req.body;

    const files = req.files?.slice(0, 3); // max 3 files
    const filePaths = files?.map(file => file.path) || [];

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      assignedTo,
      createdBy: req.user.id,
      documents: filePaths
    });

    res.status(201).json(task);

  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// GET ALL TASKS
exports.getAllTasks = async (req, res) => {
  try {
    console.log('getAllTasks called', { user: req.user, query: req.query });
    const {
      status,
      priority,
      dueDate,
      sort = 'dueDate',
      page = 1,
      limit = 10
    } = req.query;

    const query = req.user.role === 'admin'
  ? {}
  : {
      $or: [
        { createdBy: req.user.id },
        { assignedTo: req.user.id }
      ]
    };


    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (dueDate) query.dueDate = { $lte: new Date(dueDate) };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const tasks = await Task.find(query)
      .populate('assignedTo', 'email role')
      .populate('createdBy', 'email') // optional: show who created
      .sort({ [sort]: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Task.countDocuments(query);

    res.json({
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalTasks: total,
      tasks
    });

  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'email role')
      .populate('createdBy', 'email');

    if (!task) return res.status(404).json({ msg: 'Task not found' });

    const creatorId = task.createdBy?._id?.toString() || task.createdBy?.toString();
    const assignedId = task.assignedTo?._id?.toString() || task.assignedTo?.toString();

    const isCreator = creatorId === req.user.id;
    const isAssigned = assignedId === req.user.id;

    if (req.user.role !== 'admin' && !isCreator && !isAssigned) {
      return res.status(403).json({ msg: 'Unauthorized' });
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};


// UPDATE TASK
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: 'Task not found' });

    if (req.user.role !== 'admin' && task.createdBy.toString() !== req.user.id)
      return res.status(403).json({ msg: 'Unauthorized' });

    const files = req.files?.slice(0, 3);
    const filePaths = files?.map(file => file.path) || [];

    const {
      title,
      description,
      status,
      priority,
      dueDate,
      assignedTo
    } = req.body;

    const updatedFields = {
      title,
      description,
      status,
      priority,
      dueDate,
      assignedTo,
      ...(filePaths.length && { documents: filePaths })
    };

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, updatedFields, { new: true });

    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// DELETE TASK
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('createdBy', '_id');

    if (!task) return res.status(404).json({ msg: 'Task not found' });

    const creatorId = task.createdBy?._id?.toString() || task.createdBy?.toString();

    if (req.user.role !== 'admin' && creatorId !== req.user.id) {
      return res.status(403).json({ msg: 'Unauthorized to delete this task' });
    }

    await task.deleteOne(); // use deleteOne() instead of remove()
    res.json({ msg: 'Task deleted successfully' });

  } catch (err) {
    console.error('❌ Delete Task Error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};
