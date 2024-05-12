const express = require('express');
const router = express.Router();
const storagesCtrl = require('../controllers/storages');
const ensureLoggedIn = require('../config/ensureLoggedIn');


router.post('/recipes/:id/storages', ensureLoggedIn, storagesCtrl.create);
router.get('/recipes/:id/storages/:storageId/edit', ensureLoggedIn, storagesCtrl.edit);
router.put('/recipes/:id/storages/:storageId', ensureLoggedIn, storagesCtrl.update);
router.delete('/recipes/:id/storages/:storageId', ensureLoggedIn, storagesCtrl.delete);

module.exports = router;