const Recipe = require('../models/recipe');

module.exports = {
    create,
    edit,
    update,
    delete: deleteGroup
};

function create(req, res) {
    Recipe.findById(req.params.id, (err, recipe) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to find the recipe' });
        }

        req.body.user = req.user._id;
        req.body.userName = req.user.name;
        req.body.userAvatar = req.user.avatar;

        recipe.groups.push(req.body);
        recipe.save((err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Failed to create a group' });
            }
            res.redirect(`/recipes/${recipe._id}`);
        });
    });
}

function edit(req, res) {
    Recipe.findOne({ 'groups._id': req.params.groupId }, (err, recipe) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to find the group' });
        }

        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        const group = recipe.groups.id(req.params.groupId);

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        res.render('groups/edit', { title: 'Edit Group', recipe, group });
    });
}

function update(req, res) {
    Recipe.findOneAndUpdate(
        { 'groups._id': req.params.groupId },
        {
            $set: {
                'groups.$.name': req.body.name,
                'groups.$.description': req.body.description
                // Add more fields as needed
            }
        },
        { new: true },
        (err, recipe) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Failed to update the group' });
            }

            if (!recipe) {
                return res.status(404).json({ message: 'Recipe not found' });
            }

            res.redirect(`/recipes/${recipe._id}`);
        }
    );
}

async function deleteGroup(req, res, next) {
    try {
        const recipe = await Recipe.findOne({ 'groups._id': req.params.groupId });

        if (!recipe) {
            return res.redirect('/recipes');
        }

        recipe.groups.remove(req.params.groupId);
        await recipe.save();
        res.redirect(`/recipes/${recipe._id}`);
    } catch (err) {
        return next(err);
    }
}
