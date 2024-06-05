const Recipe = require('../models/recipe');

module.exports = {
    create,
    edit,
    update,
    delete: deleteStorage,
}

function create(req, res) {
    Recipe.findById(req.params.id, function(err, recipe) {
        if (err || !recipe) return res.redirect('/recipes');

        req.body.user = req.user._id;
        req.body.userName = req.user.name;
        req.body.userAvatar = req.user.avatar;

        recipe.storages.push(req.body);
        recipe.save(function(err) {
            if (err) console.error(err);
            res.redirect(`/recipes/${recipe._id}`);
        });
    });
}

function edit(req, res) {
    Recipe.findOne({ 'storages._id': req.params.storageId }, function(err, recipe) {
        if (err || !recipe) return res.status(404).json({ message: 'Recipe not found' });

        const storage = recipe.storages.id(req.params.storageId);
        if (!storage) return res.status(404).json({ message: 'Storage info not found' });

        if (!storage.user.equals(req.user._id)) {
            return res.status(403).send('Forbidden');
        }

        res.render('storages/edit', { title: 'Edit Storage Info', recipe, storage });
    });
}

function update(req, res) {
    Recipe.findOne({ 'storages._id': req.params.storageId }, function(err, recipe) {
        if (err || !recipe) return res.status(404).json({ message: 'Recipe not found' });

        const storage = recipe.storages.id(req.params.storageId);
        if (!storage) return res.status(404).json({ message: 'Storage info not found' });

        if (!storage.user.equals(req.user._id)) {
            return res.status(403).send('Forbidden');
        }

        storage.content = req.body.content;

        recipe.save(function(err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Failed to update storage info' });
            }
            res.redirect(`/recipes/${recipe._id}`);
        });
    });
}

function deleteStorage(req, res) {
    Recipe.findOne({ 'storages._id': req.params.storageId }, function(err, recipe) {
        if (err || !recipe) return res.redirect('/recipes');

        const storage = recipe.storages.id(req.params.storageId);
        if (!storage) return res.status(404).json({ message: 'Storage info not found' });

        if (!storage.user.equals(req.user._id)) {
            return res.status(403).send('Forbidden');
        }

        storage.remove();
        recipe.save(function(err) {
            if (err) console.error(err);
            res.redirect(`/recipes/${recipe._id}`);
        });
    });
}
