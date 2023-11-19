const express = require('express');
const router = express.Router();
const stepGroupsCtrl = require('../controllers/stepGroups');
const ensureLoggedIn = require('../config/ensureLoggedIn');

router.post('/recipes/:id/stepGroups', ensureLoggedIn, stepGroupsCtrl.create);
router.get('/recipes/:id/stepGroups/:stepGroupId/edit', ensureLoggedIn, stepGroupsCtrl.edit);
router.put('/recipes/:id/stepGroups/:stepGroupId', ensureLoggedIn, stepGroupsCtrl.update);
router.delete('/stepGroups/:stepGroupId', ensureLoggedIn, stepGroupsCtrl.delete);

module.exports = router;