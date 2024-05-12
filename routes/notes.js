const express = require('express');
const router = express.Router();
const notesCtrl = require('../controllers/notes');
const ensureLoggedIn = require('../config/ensureLoggedIn');


router.post('/recipes/:id/notes', ensureLoggedIn, notesCtrl.create);
router.get('/recipes/:id/notes/:noteId/edit', ensureLoggedIn, notesCtrl.edit);
router.put('/recipes/:id/notes/:noteId', ensureLoggedIn, notesCtrl.update);
router.delete('/recipes/:id/notes/:noteId', ensureLoggedIn, notesCtrl.delete);

module.exports = router;