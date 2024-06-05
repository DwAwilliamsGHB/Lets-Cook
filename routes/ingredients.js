const express = require('express');
const router = express.Router();
const ingredientsCtrl = require('../controllers/ingredients');
const ensureLoggedIn = require('../config/ensureLoggedIn');


router.post('/recipes/:id/ingredients', ensureLoggedIn, ingredientsCtrl.create);
router.get('/recipes/:id/ingredients/:ingredientId/edit', ensureLoggedIn, ingredientsCtrl.edit);
router.put('/recipes/:id/ingredients/:ingredientId', ensureLoggedIn, ingredientsCtrl.update);
router.delete('/recipes/:id/ingredients/:ingredientId', ensureLoggedIn, ingredientsCtrl.delete);
router.post('/recipes/:id/ingredientGroups/:ingredientGroupId/ingredients', ensureLoggedIn, ingredientsCtrl.groupIngredientCreate);
router.get('/recipes/:id/ingredientGroups/:ingredientGroupId/ingredients/:ingredientId/edit', ensureLoggedIn, ingredientsCtrl.groupIngredientEdit);
router.put('/recipes/:id/ingredientGroups/:ingredientGroupId/ingredients/:ingredientId', ensureLoggedIn, ingredientsCtrl.groupIngredientUpdate);
router.delete('/recipes/:id/ingredientGroups/:ingredientGroupId/ingredients/:ingredientId', ensureLoggedIn, ingredientsCtrl.delete);


module.exports = router;