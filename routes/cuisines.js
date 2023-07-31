const express = require('express');
const router = express.Router();
const cuisinesCtrl = require('../controllers/cuisines');
const ensureLoggedIn = require('../config/ensureLoggedIn')

router.get('/cuisines/index', ensureLoggedIn, cuisinesCtrl.new);
router.get('/cuisines/:id', cuisinesCtrl.show);
router.post('/cuisines', ensureLoggedIn,  cuisinesCtrl.create);
router.get('/cuisines/:id/edit', ensureLoggedIn, cuisinesCtrl.edit);
router.put('/cuisines/:id', ensureLoggedIn, cuisinesCtrl.update);
router.get('/cuisines/:id/delete', ensureLoggedIn, cuisinesCtrl.confirmDelete);
router.delete('/cuisines/:id', ensureLoggedIn, cuisinesCtrl.delete)

module.exports = router;