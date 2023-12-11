const express = require('express');
const sitesController = require('../controllers/siteController');
const router = express.Router();
const verifyJWT = require('../middleware/verifyJWT');
const checkRole = require('../middleware/checkRole');

router.use(verifyJWT);

router
  .route('/')
  .get(sitesController.getAllSites)
  .post(checkRole, sitesController.createNewSite)
  .patch(checkRole, sitesController.updateSite)
  .delete(checkRole, sitesController.deleteSite);

module.exports = router;
