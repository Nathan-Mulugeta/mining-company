const express = require('express');
const router = express.Router();
const managersController = require('../controllers/managerController');
const verifyJWT = require('../middleware/verifyJWT');
const checkRole = require('../middleware/checkRole');

router.use(verifyJWT);

router
  .route('/')
  .get(managersController.getAllManagers)
  .post(checkRole, managersController.createNewManager)
  .patch(managersController.updateManager)
  .delete(checkRole, managersController.deleteManager);

module.exports = router;
