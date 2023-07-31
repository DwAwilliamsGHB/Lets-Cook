var express = require('express');
var router = express.Router();
var recipesCtrl = require('../controllers/recipes');
const ensureLoggedIn = require('../config/ensureLoggedIn')


router.get('/', recipesCtrl.index);
router.get('/new', ensureLoggedIn, recipesCtrl.new);
router.get('/:id', recipesCtrl.show);
router.post('/', ensureLoggedIn, recipesCtrl.create);
router.get('/:id/edit', ensureLoggedIn, recipesCtrl.edit)
router.put('/:id', ensureLoggedIn, recipesCtrl.update)
router.get('/:id/delete', ensureLoggedIn, recipesCtrl.confirmDelete);
router.delete('/:id', ensureLoggedIn, recipesCtrl.delete);

module.exports = router;
