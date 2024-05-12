const express = require('express');
const router = express.Router();
const freezersCtrl = require('../controllers/freezers');
const ensureLoggedIn = require('../config/ensureLoggedIn');


router.post('/recipes/:id/freezers', ensureLoggedIn, freezersCtrl.create);
router.get('/recipes/:id/freezers/:freezerId/edit', ensureLoggedIn, freezersCtrl.edit);
router.put('/recipes/:id/freezers/:freezerId', ensureLoggedIn, freezersCtrl.update);
router.delete('/recipes/:id/freezers/:freezerId', ensureLoggedIn, freezersCtrl.delete);

module.exports = router;