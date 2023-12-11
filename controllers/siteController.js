const Site = require('../models/Site');

// @desc    Get all sites
// @route   GET /sites
// @access  Public
const getAllSites = async (req, res) => {
  const sites = await Site.find();
  if (!sites.length) {
    throw new Error('No sites found');
  }
  res.status(200).json(sites);
};

// @desc    Create a new site
// @route   POST /sites
// @access  Public
const createNewSite = async (req, res) => {
  const { name, location, description } = req.body;

  const newSite = await Site.create({ name, location, description });

  res.status(201).json(newSite);
};

// @desc    Update a site by ID
// @route   PUT /sites/:id
// @access  Public
const updateSite = async (req, res) => {
  const { id } = req.body;
  const { name, location, description } = req.body;

  const updatedSite = await Site.findByIdAndUpdate(
    id,
    { name, location, description },
    { new: true }
  );

  if (!updatedSite) {
    res.status(404);
    throw new Error('Site not found');
  }

  res.status(200).json(updatedSite);
};

// @desc    Delete a site by ID
// @route   DELETE /sites/:id
// @access  Public
const deleteSite = async (req, res) => {
  const { id } = req.body;

  const deletedSite = await Site.findByIdAndDelete(id);

  if (!deletedSite) {
    res.status(404);
    throw new Error('Site not found');
  }

  res.status(200).json({ message: 'Site deleted' });
};

module.exports = {
  getAllSites,
  createNewSite,
  updateSite,
  deleteSite,
};
