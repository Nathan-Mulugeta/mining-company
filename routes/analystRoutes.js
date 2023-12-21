const express = require('express');
const router = express.Router();
const analystController = require('../controllers/analystController');
const verifyJWT = require('../middleware/verifyJWT');

// router.use(verifyJWT);

router.route('/').get(analystController.getAllAnalysts);

module.exports = router;
