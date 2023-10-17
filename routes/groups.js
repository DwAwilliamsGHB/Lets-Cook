const express = require('express');
const router = express.Router();
const groupsCtrl = require('../controllers/groups');
const ensureLoggedIn = require('../config/ensureLoggedIn');

router.post('/recipes/:id/groups', ensureLoggedIn, groupsCtrl.create);
router.get('/recipes/:id/groups/:groupId/edit', ensureLoggedIn, groupsCtrl.edit);
router.put('/recipes/:id/groups/:groupId', ensureLoggedIn, groupsCtrl.update);
router.delete('/groups/:groupId', ensureLoggedIn, groupsCtrl.delete);

module.exports = router;