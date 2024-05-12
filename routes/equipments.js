const express = require('express');
const router = express.Router();
const equipmentsCtrl = require('../controllers/equipments');
const ensureLoggedIn = require('../config/ensureLoggedIn');


router.post('/recipes/:id/equipments', ensureLoggedIn, equipmentsCtrl.create);
router.get('/recipes/:id/equipments/:equipmentId/edit', ensureLoggedIn, equipmentsCtrl.edit);
router.put('/recipes/:id/equipments/:equipmentId', ensureLoggedIn, equipmentsCtrl.update);
router.delete('/recipes/:id/equipments/:equipmentId', ensureLoggedIn, equipmentsCtrl.delete);

module.exports = router;