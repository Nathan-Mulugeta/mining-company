const Admin = require('../models/Admin');

// @desc    Get all admins
// @route   GET /admins
// @access  Private
const getAllAdmins = async (req, res) => {
  // Get all admins from MongoDB
  const admins = await Admin.find().populate('user').lean();

  //   If no admins
  if (!admins?.length) {
    return res.status(400).json({ message: 'No admins found' });
  }

  res.json(admins);
};

module.exports = {
  getAllAdmins,
};
