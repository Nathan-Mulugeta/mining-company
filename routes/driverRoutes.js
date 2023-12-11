const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driverController');
const verifyJWT = require('../middleware/verifyJWT');

// router.use(verifyJWT);

router.route('/').get(driverController.getAllDrivers);

module.exports = router;
