const Driver = require('../models/Driver');

// @desc    Get all drivers
// @route   GET /drivers
// @access  Private
const getAllDrivers = async (req, res) => {
  // Get all drivers from MongoDB
  const drivers = await Driver.find().populate('user').lean();

  //   If no drivers
  if (!drivers?.length) {
    return res.status(400).json({ message: 'No drivers found' });
  }

  res.json(drivers);
};

module.exports = {
  getAllDrivers,
};
