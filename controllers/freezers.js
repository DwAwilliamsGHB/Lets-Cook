const Recipe = require('../models/recipe');

module.exports = {
    create,
    edit,
    update,
    delete: deleteFreezer,
}

function create(req, res) {
    Recipe.findById(req.params.id, function(err, recipe) {
        if (err || !recipe) return res.redirect('/recipes');

        req.body.user = req.user._id;
        req.body.userName = req.user.name;
        req.body.userAvatar = req.user.avatar;

        recipe.freezers.push(req.body);
        recipe.save(function(err) {
            if (err) console.error(err);
            res.redirect(`/recipes/${recipe._id}`);
        });
    });
}

function edit(req, res) {
    Recipe.findOne({ 'freezers._id': req.params.freezerId }, function(err, recipe) {
        if (err || !recipe) return res.status(404).json({ message: 'Recipe not found' });

        const freezer = recipe.freezers.id(req.params.freezerId);
        if (!freezer) return res.status(404).json({ message: 'Freezing info not found' });

        res.render('freezers/edit', { title: 'Edit Freezing Info', recipe, freezer });
    });
}

function update(req, res) {
    Recipe.findOneAndUpdate(
        { 'freezers._id': req.params.freezerId },
        { $set: { 'freezers.$.content': req.body.content } },
        { new: true },
        function(err, recipe) {
            if (err || !recipe) return res.status(404).json({ message: 'Freezing info not found' });
            res.redirect(`/recipes/${recipe._id}`);
        }
    );
}

function deleteFreezer(req, res) {
    Recipe.findOne({ 'freezers._id': req.params.freezerId }, function(err, recipe) {
        if (err || !recipe) return res.redirect('/recipes');

        recipe.freezers.id(req.params.freezerId).remove();
        recipe.save(function(err) {
            if (err) console.error(err);
            res.redirect(`/recipes/${recipe._id}`);
        });
    });
}