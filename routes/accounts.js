const express = require('express');
const router = express.Router();
const ensureLoggedIn = require('../config/ensureLoggedIn');
const accountsCtrl = require('../controllers/accounts');

router.get('/', ensureLoggedIn, accountsCtrl.show);
router.get('/editUsername', ensureLoggedIn, accountsCtrl.editUsername);
router.post('/editUsername', ensureLoggedIn, accountsCtrl.updateUsername);

module.exports = router;
