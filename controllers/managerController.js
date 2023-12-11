const Manager = require('../models/Manager');

// @desc    Get all managers
// @route   GET /managers
// @access  Private
const getAllManagers = async (req, res) => {
  // Get all managers from MongoDB
  const managers = await Manager.find().lean();

  //   If no managers
  if (!managers?.length) {
    return res.status(400).json({ message: 'No managers found' });
  }

  res.json(managers);
};

module.exports = {
  getAllManagers,
};
