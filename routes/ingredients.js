const express = require('express')
const router = express.Router()
const ingredientsCtrl = require('../controllers/ingredients')
const ensureLoggedIn = require('../config/ensureLoggedIn') 

router.post('/recipes/:id/ingredients', ensureLoggedIn, ingredientsCtrl.create)
router.delete('/ingredients/:id', ensureLoggedIn, ingredientsCtrl.delete)

module.exports = router
