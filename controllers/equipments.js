const Recipe = require('../models/recipe');

module.exports = {
    create,
    edit,
    update,
    delete: deleteEquipment,
}

function create(req, res) {
    Recipe.findById(req.params.id, function(err, recipe) {
        if (err || !recipe) return res.redirect('/recipes');

        req.body.user = req.user._id;
        req.body.userName = req.user.name;
        req.body.userAvatar = req.user.avatar;

        recipe.equipments.push(req.body);
        recipe.save(function(err) {
            if (err) console.error(err);
            res.redirect(`/recipes/${recipe._id}`);
        });
    });
}

function edit(req, res) {
    Recipe.findOne({ 'equipments._id': req.params.equipmentId }, function(err, recipe) {
        if (err || !recipe) return res.status(404).json({ message: 'Recipe not found' });

        const equipment = recipe.equipments.id(req.params.equipmentId);
        if (!equipment) return res.status(404).json({ message: 'Equipment item not found' });

        res.render('equipments/edit', { title: 'Edit Equipment Item', recipe, equipment });
    });
}

function update(req, res) {
    Recipe.findOneAndUpdate(
        { 'equipments._id': req.params.equipmentId },
        { $set: { 'equipments.$.content': req.body.content } },
        { new: true },
        function(err, recipe) {
            if (err || !recipe) return res.status(404).json({ message: 'Equipment item not found' });
            res.redirect(`/recipes/${recipe._id}`);
        }
    );
}

function deleteEquipment(req, res) {
    Recipe.findOne({ 'equipments._id': req.params.equipmentId }, function(err, recipe) {
        if (err || !recipe) return res.redirect('/recipes');

        recipe.equipments.id(req.params.equipmentId).remove();
        recipe.save(function(err) {
            if (err) console.error(err);
            res.redirect(`/recipes/${recipe._id}`);
        });
    });
}