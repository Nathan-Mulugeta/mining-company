const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const verifyJWT = require('../middleware/verifyJWT');

router.use(verifyJWT);

router.route('/').get(adminController.getAllAdmins);

module.exports = router;
