const Vehicle = require('../models/Vehicle');

// @desc    Get all vehicles
// @route   GET /vehicles
// @access  Public
const getAllVehicles = async (req, res) => {
  const vehicles = await Vehicle.find();
  if (!vehicles.length) {
    throw new Error('No vehicles found');
  }
  res.status(200).json(vehicles);
};

// @desc    Create a new vehicle
// @route   POST /vehicles
// @access  Public
const createNewVehicle = async (req, res) => {
  const { plateNumber, vehicleType } = req.body;

  const newVehicle = await Vehicle.create({ plateNumber, vehicleType });

  res.status(201).json(newVehicle);
};

// @desc    Update a vehicle by ID
// @route   PUT /vehicles/:id
// @access  Public
const updateVehicle = async (req, res) => {
  const { id } = req.body;
  const { plateNumber, vehicleType } = req.body;

  const updatedVehicle = await Vehicle.findByIdAndUpdate(
    id,
    { plateNumber, vehicleType },
    { new: true }
  );

  if (!updatedVehicle) {
    res.status(404).json({ message: 'Vehicle not found' });
    return;
  }

  res.status(200).json(updatedVehicle);
};

// @desc    Delete a vehicle by ID
// @route   DELETE /vehicles/:id
// @access  Public
const deleteVehicle = async (req, res) => {
  const { id } = req.body;

  const deletedVehicle = await Vehicle.findByIdAndDelete(id);

  if (!deletedVehicle) {
    res.status(404);
    throw new Error('Vehicle not found');
  }

  res.status(200).json({ message: 'Vehicle deleted' });
};

module.exports = {
  getAllVehicles,
  createNewVehicle,
  updateVehicle,
  deleteVehicle,
};
