const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driverController');
const verifyJWT = require('../middleware/verifyJWT');
const checkRole = require('../middleware/checkRole');

router.use(verifyJWT);

router
  .route('/')
  .get(driverController.getAllDrivers)
  .post(checkRole, driverController.createNewDriver)
  .patch(checkRole, driverController.updateDriver)
  .delete(checkRole, driverController.deleteDriver);

module.exports = router;
