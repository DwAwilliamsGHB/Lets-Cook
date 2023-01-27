const express = require('express');
const router = express.Router();
const cuisinesCtrl = require('../controllers/cuisines');
const ensureLoggedIn = require('../config/ensureLoggedIn')

router.get('/cuisines/new', ensureLoggedIn, cuisinesCtrl.new);
router.post('/cuisines', ensureLoggedIn,  cuisinesCtrl.create);
router.post('/recipes/:id/cuisines', cuisinesCtrl.addToOrigin)


module.exports = router;