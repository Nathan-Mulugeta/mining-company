const Analyst = require('../models/Analyst');

// @desc    Get all analysts
// @route   GET /analysts
// @access  Private
const getAllAnalysts = async (req, res) => {
  // Get all analysts from MongoDB
  const analysts = await Analyst.find().populate('user').lean();

  //   If no analysts
  if (!analysts?.length) {
    return res.status(400).json({ message: 'No analysts found' });
  }

  res.json(analysts);
};

module.exports = {
  getAllAnalysts,
};
