const express = require('express');
const router = express.Router();
const ingredientGroupsCtrl = require('../controllers/ingredientGroups');
const ensureLoggedIn = require('../config/ensureLoggedIn');

router.post('/recipes/:id/ingredientGroups', ensureLoggedIn, ingredientGroupsCtrl.create);
router.get('/recipes/:id/ingredientGroups/:ingredientGroupId/edit', ensureLoggedIn, ingredientGroupsCtrl.edit);
router.put('/recipes/:id/ingredientGroups/:ingredientGroupId', ensureLoggedIn, ingredientGroupsCtrl.update);
router.delete('/ingredientGroups/:ingredientGroupId', ensureLoggedIn, ingredientGroupsCtrl.delete);

module.exports = router;