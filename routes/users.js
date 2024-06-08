const express = require('express');
const router = express.Router();
const ensureLoggedIn = require('../config/ensureLoggedIn');
const usersCtrl = require('../controllers/users');

router.get('/username', ensureLoggedIn, usersCtrl.showUsernameForm);
router.post('/username', ensureLoggedIn, usersCtrl.createUsername);

module.exports = router;
