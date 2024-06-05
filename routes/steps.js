const express = require('express');
const router = express.Router();
const stepsCtrl = require('../controllers/steps');
const ensureLoggedIn = require('../config/ensureLoggedIn') ;


router.post('/recipes/:id/steps', ensureLoggedIn, stepsCtrl.create);
router.get('/recipes/:id/steps/:stepId/edit', ensureLoggedIn, stepsCtrl.edit);
router.put('/recipes/:id/steps/:stepId', ensureLoggedIn, stepsCtrl.update);
router.delete('/steps/:id', ensureLoggedIn, stepsCtrl.delete);
router.post('/recipes/:id/stepGroups/:stepGroupId/steps', ensureLoggedIn, stepsCtrl.groupStepCreate);
router.get('/recipes/:id/stepGroups/:stepGroupId/steps/:stepId/edit', ensureLoggedIn, stepsCtrl.groupStepEdit);
router.put('/recipes/:id/stepGroups/:stepGroupId/steps/:stepId', ensureLoggedIn, stepsCtrl.groupStepUpdate);
router.delete('/recipes/:id/stepGroups/:stepGroupId/steps/:stepId', ensureLoggedIn, stepsCtrl.delete);

module.exports = router
