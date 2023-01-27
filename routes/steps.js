const express = require('express')
const router = express.Router()
const stepsCtrl = require('../controllers/steps')
const ensureLoggedIn = require('../config/ensureLoggedIn') 

router.post('/recipes/:id/steps', ensureLoggedIn, stepsCtrl.create)
router.delete('/steps/:id', ensureLoggedIn, stepsCtrl.delete)

module.exports = router
