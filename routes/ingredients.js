const express = require('express')
const router = express.Router()
const ingredientsCtrl = require('../controllers/ingredients')
const ensureLoggedIn = require('../config/ensureLoggedIn') 


router.post('/recipes/:id/ingredients', ensureLoggedIn, ingredientsCtrl.create)
router.get('/recipes/:id/ingredients/:ingredientId/edit', ensureLoggedIn, ingredientsCtrl.edit);
router.put('/recipes/:id/ingredients/:ingredientId', ensureLoggedIn, ingredientsCtrl.update);
router.delete('/ingredients/:id', ensureLoggedIn, ingredientsCtrl.delete)

module.exports = router
