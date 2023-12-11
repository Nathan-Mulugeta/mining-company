const express = require('express');
const vehiclesController = require('../controllers/vehicleController');
const router = express.Router();
const verifyJWT = require('../middleware/verifyJWT');
const checkRole = require('../middleware/checkRole');

// router.use(verifyJWT);

router
  .route('/')
  .get(vehiclesController.getAllVehicles)
  .post(
    // checkRole,
    vehiclesController.createNewVehicle
  )
  .patch(
    // checkRole,
    vehiclesController.updateVehicle
  )
  .delete(
    // checkRole,
    vehiclesController.deleteVehicle
  );

module.exports = router;
