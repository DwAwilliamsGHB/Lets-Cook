const express = require('express')
const router = express.Router()
const ingredientsCtrl = require('../controllers/ingredients')
const ensureLoggedIn = require('../config/ensureLoggedIn') 


router.post('/recipes/:id/ingredients', ensureLoggedIn, ingredientsCtrl.create)
router.get('/recipes/:id/ingredients/:ingredientId/edit', ensureLoggedIn, ingredientsCtrl.edit);
router.put('/recipes/:id/ingredients/:ingredientId', ensureLoggedIn, ingredientsCtrl.update);
router.delete('/recipes/:id/ingredients/:ingredientId', ensureLoggedIn, ingredientsCtrl.delete)
router.post('/recipes/:id/groups/:groupId/ingredients', ensureLoggedIn, ingredientsCtrl.createGroupIngredient);
router.get('/recipes/:id/groups/:groupId/ingredients/:ingredientId/groupIngredientEdit', ensureLoggedIn, ingredientsCtrl.editGroupIngredient);
router.put('/recipes/:id/groups/:groupId/ingredients/:ingredientId', ensureLoggedIn, ingredientsCtrl.updateGroupIngredient);
router.delete('/recipes/:id/groups/:groupId/ingredients/:ingredientId', ensureLoggedIn, ingredientsCtrl.delete);


module.exports = router
