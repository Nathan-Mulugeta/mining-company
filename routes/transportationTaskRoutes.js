const express = require('express');
const transportationTasksController = require('../controllers/transportationTaskController');
const router = express.Router();
const verifyJWT = require('../middleware/verifyJWT');
const checkRole = require('../middleware/checkRole');

// router.use(verifyJWT);

router
  .route('/')
  .get(transportationTasksController.getAllTransportationTasks)
  .post(
    // checkRole,
    transportationTasksController.createNewTransportationTask
  )
  .patch(
    // checkRole,
    transportationTasksController.updateTransportationTask
  )
  .delete(
    // checkRole,
    transportationTasksController.deleteTransportationTask
  );

module.exports = router;
