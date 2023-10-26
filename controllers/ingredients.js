const Recipe = require('../models/recipe')
const Ingredient = require('../models/recipe')

module.exports = {
    create,
    createGroupIngredient,
    edit,
    update,
    delete: deleteIngredient
}

function create(req, res) {
    Recipe.findOne({ _id: req.params.id }, function (err, recipe) {
        if (err || !recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        // Create the ingredient object and add it to the main recipe's ingredients array
        const ingredient = {
            user: req.user._id,
            userName: req.user.name,
            userAvatar: req.user.avatar,
            quantity: req.body.quantity,
            measurement: req.body.measurement,
            content: req.body.content,
        };

        recipe.ingredients.push(ingredient);

        recipe.save(function (err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Failed to add ingredient to recipe' });
            }
            res.redirect(`/recipes/${recipe._id}`);
        });
    });
}

function createGroupIngredient(req, res) {
    Recipe.findOne({ _id: req.params.id, 'groups._id': req.params.groupId }, function (err, recipe) {
        if (err || !recipe) {
            return res.status(404).json({ message: 'Recipe or Group not found' });
        }

        // Create the ingredient object and add it to the group's ingredients array
        const ingredient = {
            user: req.user._id,
            userName: req.user.name,
            userAvatar: req.user.avatar,
            quantity: req.body.quantity,
            measurement: req.body.measurement,
            content: req.body.content,
        };

        const group = recipe.groups.id(req.params.groupId);
        group.ingredients.push(ingredient);

        recipe.save(function (err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Failed to add ingredient to group' });
            }
            res.redirect(`/recipes/${recipe._id}`);
        });
    });
}

function edit(req, res) {
    Recipe.findOne({ 'ingredients._id': req.params.ingredientId }, (err, recipe) => {
        if (err || !recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        const ingredient = recipe.ingredients.id(req.params.ingredientId); // Find the specific ingredient by ID
        if (!ingredient) {
            return res.status(404).json({ message: 'Ingredient not found' });
        }
        res.render('ingredients/edit', { title: 'Edit Ingredient', recipe, ingredient });
    });
}

function update(req, res) {
    Recipe.findOneAndUpdate(
        { 'ingredients._id': req.params.ingredientId },
        {
            $set: {
                'ingredients.$.quantity': req.body.quantity,
                'ingredients.$.measurement': req.body.measurement,
                'ingredients.$.content': req.body.content,
            }
        },
        { new: true },
        (err, recipe) => {
            if (err || !recipe) {
                return res.status(404).json({ message: 'Ingredient not found' });
            }
            res.redirect(`/recipes/${recipe._id}`);
        }
    );
}
  
async function deleteIngredient(req, res, next) {
    try {
        // Attempt to find the recipe
        const recipe = await Recipe.findOne({ _id: req.params.id });

        if (!recipe) {
            return res.redirect('/recipes');
        }

        // Check if the ingredient is in the main recipe's ingredient list
        let ingredient = recipe.ingredients.id(req.params.ingredientId);

        if (!ingredient) {
            // If the ingredient is not in the main recipe's list, search within groups
            for (const group of recipe.groups) {
                ingredient = group.ingredients.id(req.params.ingredientId);
                if (ingredient) {
                    // Remove the ingredient from the group
                    group.ingredients.remove(ingredient);
                    break; // Exit the loop once found
                }
            }
        } else {
            // Remove the ingredient from the main recipe
            recipe.ingredients.remove(ingredient);
        }

        await recipe.save();
        res.redirect(`/recipes/${recipe._id}`);
    } catch (err) {
        return next(err);
    }
}