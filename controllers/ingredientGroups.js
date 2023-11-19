const Recipe = require('../models/recipe');

module.exports = {
    create,
    edit,
    update,
    delete: ingredientGroupDelete
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

        recipe.ingredientGroups.push(req.body);
        recipe.save((err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Failed to create an ingredient group' });
            }
            res.redirect(`/recipes/${recipe._id}`);
        });
    });
}

function edit(req, res) {
    Recipe.findOne({ 'ingredientGroups._id': req.params.ingredientGroupId }, (err, recipe) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to find the ingredient group' });
        }

        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        const ingredientGroup = recipe.ingredientGroups.id(req.params.ingredientGroupId);

        if (!ingredientGroup) {
            return res.status(404).json({ message: 'Ingredient Group not found' });
        }

        res.render('ingredientGroups/edit', { title: 'Edit Group Name', recipe, ingredientGroup });
    });
}

function update(req, res) {
    Recipe.findOneAndUpdate(
        { 'ingredientGroups._id': req.params.ingredientGroupId },
        {
            $set: {
                'ingredientGroups.$.name': req.body.name,
                'ingredientGroups.$.description': req.body.description
                // Add more fields as needed
            }
        },
        { new: true },
        (err, recipe) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Failed to update the ingredient group' });
            }

            if (!recipe) {
                return res.status(404).json({ message: 'Recipe not found' });
            }

            res.redirect(`/recipes/${recipe._id}`);
        }
    );
}

async function ingredientGroupDelete(req, res, next) {
    try {
        const recipe = await Recipe.findOne({ 'ingredientGroups._id': req.params.ingredientGroupId });

        if (!recipe) {
            return res.redirect('/recipes');
        }

        recipe.ingredientGroups.remove(req.params.ingredientGroupId);
        await recipe.save();
        res.redirect(`/recipes/${recipe._id}`);
    } catch (err) {
        return next(err);
    }
}
