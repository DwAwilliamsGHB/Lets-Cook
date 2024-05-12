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

        res.render('notes/edit', { title: 'Edit Note', recipe, note });
    });
}

function update(req, res) {
    Recipe.findOneAndUpdate(
        { 'notes._id': req.params.noteId },
        { $set: { 'notes.$.content': req.body.content } },
        { new: true },
        function(err, recipe) {
            if (err || !recipe) return res.status(404).json({ message: 'Note not found' });
            res.redirect(`/recipes/${recipe._id}`);
        }
    );
}

function deleteNote(req, res) {
    Recipe.findOne({ 'notes._id': req.params.noteId }, function(err, recipe) {
        if (err || !recipe) return res.redirect('/recipes');

        recipe.notes.id(req.params.noteId).remove();
        recipe.save(function(err) {
            if (err) console.error(err);
            res.redirect(`/recipes/${recipe._id}`);
        });
    });
}