var express = require('express');
var router = express.Router();
var recipesCtrl = require('../controllers/recipes');
const ensureLoggedIn = require('../config/ensureLoggedIn')

// All routes start with '/recipes'

router.get('/', recipesCtrl.index);
router.get('/new', ensureLoggedIn, recipesCtrl.new);
router.get('/:id', recipesCtrl.show);
router.post('/', ensureLoggedIn, recipesCtrl.create);

module.exports = router;
