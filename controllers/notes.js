const Recipe = require('../models/recipe');

module.exports = {
    create,
    edit,
    update,
    delete: deleteNote,
}

function create(req, res) {
    Recipe.findById(req.params.id, function(err, recipe) {
        if (err || !recipe) return res.redirect('/recipes');

        req.body.user = req.user._id;
        req.body.userName = req.user.name;
        req.body.userAvatar = req.user.avatar;

        recipe.notes.push(req.body);
        recipe.save(function(err) {
            if (err) console.error(err);
            res.redirect(`/recipes/${recipe._id}`);
        });
    });
}

function edit(req, res) {
    Recipe.findOne({ 'notes._id': req.params.noteId }, function(err, recipe) {
        if (err || !recipe) return res.status(404).json({ message: 'Recipe not found' });

        const note = recipe.notes.id(req.params.noteId);
        if (!note) return res.status(404).json({ message: 'Note not found' });

        if (!note.user.equals(req.user._id)) {
            return res.status(403).send('Forbidden');
        }

        res.render('notes/edit', { title: 'Edit Note', recipe, note });
    });
}

function update(req, res) {
    Recipe.findOne({ 'notes._id': req.params.noteId }, function(err, recipe) {
        if (err || !recipe) return res.status(404).json({ message: 'Recipe not found' });

        const note = recipe.notes.id(req.params.noteId);
        if (!note) return res.status(404).json({ message: 'Note not found' });

        if (!note.user.equals(req.user._id)) {
            return res.status(403).send('Forbidden');
        }

        note.content = req.body.content;

        recipe.save(function(err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Failed to update note' });
            }
            res.redirect(`/recipes/${recipe._id}`);
        });
    });
}

function deleteNote(req, res) {
    Recipe.findOne({ 'notes._id': req.params.noteId }, function(err, recipe) {
        if (err || !recipe) return res.redirect('/recipes');

        const note = recipe.notes.id(req.params.noteId);
        if (!note) return res.status(404).json({ message: 'Note not found' });

        if (!note.user.equals(req.user._id)) {
            return res.status(403).send('Forbidden');
        }

        note.remove();
        recipe.save(function(err) {
            if (err) console.error(err);
            res.redirect(`/recipes/${recipe._id}`);
        });
    });
}
