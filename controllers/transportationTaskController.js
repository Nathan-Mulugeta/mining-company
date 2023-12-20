const TransportationTask = require('../models/TransportationTask');
const mongoose = require('mongoose');

// Validation functions
const validateTaskInput = (req) => {
  const {
    filledBy,
    cargo,
    source,
    destination,
    assignedVehicle,
    assignedDriver,
    scheduledTime,
  } = req.body;

  if (
    !filledBy ||
    !cargo ||
    !source ||
    !destination ||
    !assignedVehicle ||
    !assignedDriver ||
    !scheduledTime
  ) {
    throw new Error('Please fill out all required fields');
  }
};

// Controllers
// @desc    Get all transportation tasks
// @route   GET /transportationTasks
// @access  Public
const getAllTransportationTasks = async (req, res) => {
  const tasks = await TransportationTask.find()
    .populate({ path: 'filledBy', select: '-password' })
    .populate('source')
    .populate('destination')
    .populate('assignedVehicle')
    .populate({
      path: 'assignedDriver',
      populate: { path: 'user' },
    })
    .lean();
  if (!tasks.length) {
    throw new Error('No transportation tasks found');
  }
  res.status(200).json(tasks);
};

// @desc    Create a new transportation task
// @route   POST /transportationTasks
// @access  Public
const createNewTransportationTask = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  validateTaskInput(req);

  const {
    filledBy,
    cargo,
    source,
    destination,
    assignedVehicle,
    assignedDriver,
    scheduledTime,
  } = req.body;

  const [newTask] = await TransportationTask.create(
    [
      {
        filledBy,
        cargo,
        source,
        destination,
        assignedVehicle,
        assignedDriver,
        scheduledTime,
      },
    ],
    { session }
  );

  if (!newTask) {
    await session.abortTransaction();
    session.endSession();
    throw new Error('Failed to create a new transportation task');
  }

  await session.commitTransaction();
  session.endSession();

  res
    .status(201)
    .json({ message: 'New transportation task created', task: newTask });
};

// @desc    Update a transportation task by ID
// @route   PUT /transportationTasks/:id
// @access  Public
const updateTransportationTask = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  validateTaskInput(req);

  const {
    id,
    filledBy,
    cargo,
    source,
    destination,
    assignedVehicle,
    assignedDriver,
    scheduledTime,
    completed,
  } = req.body;

  // TODO: check if the object need to be an array as well here since we are passing by the session
  const updatedTask = await TransportationTask.findByIdAndUpdate(
    id,
    {
      filledBy,
      cargo,
      source,
      destination,
      assignedVehicle,
      assignedDriver,
      scheduledTime,
      completed,
    },
    { new: true, session }
  );

  if (!updatedTask) {
    await session.abortTransaction();
    session.endSession();
    throw new Error('Transportation task not found');
  }

  await session.commitTransaction();
  session.endSession();

  res
    .status(200)
    .json({ message: 'Transportation task updated', task: updatedTask });
};

// @desc    Delete a transportation task by ID
// @route   DELETE /transportationTasks/:id
// @access  Public
const deleteTransportationTask = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  const { id } = req.body;
  const task = await TransportationTask.findById(id).session(session);

  if (!task) {
    await session.abortTransaction();
    session.endSession();
    throw new Error('Transportation task not found');
  }

  await TransportationTask.findByIdAndDelete(id).session(session);

  await session.commitTransaction();
  session.endSession();

  res.status(200).json({ message: 'Transportation task deleted' });
};

module.exports = {
  getAllTransportationTasks,
  createNewTransportationTask,
  updateTransportationTask,
  deleteTransportationTask,
};
