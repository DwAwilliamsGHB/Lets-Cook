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
            return res.status(404).json({ message: 'Ingredient group not found' });
        }

        if (!ingredientGroup.user.equals(req.user._id)) {
            return res.status(403).send('Forbidden');
        }

        res.render('ingredientGroups/edit', { title: 'Edit Group', recipe, ingredientGroup });
    });
}

function update(req, res) {
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
            return res.status(404).json({ message: 'Ingredient group not found' });
        }

        if (!ingredientGroup.user.equals(req.user._id)) {
            return res.status(403).send('Forbidden');
        }

        ingredientGroup.name = req.body.name;

        recipe.save((err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Failed to update the ingredient group' });
            }
            res.redirect(`/recipes/${recipe._id}`);
        });
    });
}

async function ingredientGroupDelete(req, res, next) {
    try {
        const recipe = await Recipe.findOne({ 'ingredientGroups._id': req.params.ingredientGroupId });

        if (!recipe) {
            return res.redirect('/recipes');
        }

        const ingredientGroup = recipe.ingredientGroups.id(req.params.ingredientGroupId);

        if (!ingredientGroup.user.equals(req.user._id)) {
            return res.status(403).send('Forbidden');
        }

        recipe.ingredientGroups.remove(req.params.ingredientGroupId);
        await recipe.save();
        res.redirect(`/recipes/${recipe._id}`);
    } catch (err) {
        return next(err);
    }
}
