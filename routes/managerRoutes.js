const express = require('express');
const router = express.Router();
const managersController = require('../controllers/managerController');
const verifyJWT = require('../middleware/verifyJWT');

// router.use(verifyJWT);

router.route('/').get(managersController.getAllManagers);

module.exports = router;
