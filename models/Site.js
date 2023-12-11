const mongoose = require('mongoose');

const siteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
});

module.exports = mongoose.model('Site', siteSchema);
