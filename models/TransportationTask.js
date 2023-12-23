const mongoose = require('mongoose');

const transportationTaskSchema = new mongoose.Schema(
  {
    filledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    cargo: {
      description: {
        type: String,
        required: true,
      },
      weight: {
        type: Number,
        required: true,
      },
      pricePerTon: {
        type: Number,
        required: true,
      },
    },
    source: {
      // type: mongoose.Schema.Types.ObjectId,
      // ref: 'Site',
      type: String,
      required: true,
    },
    destination: {
      // type: mongoose.Schema.Types.ObjectId,
      // ref: 'Site',
      type: String,
      required: true,
    },
    assignedVehicle: {
      // type: mongoose.Schema.Types.ObjectId,
      // ref: 'Vehicle',
      type: String,
      required: true,
    },
    assignedDriver: {
      // type: mongoose.Schema.Types.ObjectId,
      // ref: 'Driver',
      type: String,
      required: true,
    },
    scheduledTime: {
      type: Date,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('TransportationTask', transportationTaskSchema);
