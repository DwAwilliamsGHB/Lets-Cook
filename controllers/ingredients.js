const Recipe = require('../models/recipe')

module.exports = {
    create,
    createGroupIngredient,
    edit,
    editGroupIngredient,
    update,
    updateGroupIngredient,
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

async function edit(req, res, next) {
    try {
        const recipe = await Recipe.findById(req.params.id);
        const ingredient = recipe.ingredients.id(req.params.ingredientId);
        res.render('ingredients/edit', { title: 'Edit Ingredient', recipe, ingredient });
    } catch (err) {
        return next(err);
    }
}

async function editGroupIngredient(req, res, next) {
    try {
        const recipe = await Recipe.findById(req.params.id);
        const group = recipe.groups.id(req.params.groupId);
        const ingredient = group.ingredients.id(req.params.ingredientId);
        res.render('groupIngredients/groupIngredientEdit', { title: 'Edit Ingredient', recipe, group, ingredient });
    } catch (err) {
        return next(err);
    }
}

async function update(req, res, next) {
    try {
        const { id, ingredientId } = req.params;
        const recipe = await Recipe.findById(id);
        const ingredient = recipe.ingredients.id(ingredientId);

        // Update the ingredient properties
        ingredient.quantity = req.body.quantity;
        ingredient.measurement = req.body.measurement;
        ingredient.content = req.body.content;

        await recipe.save();

        res.redirect(`/recipes/${id}`);
    } catch (err) {
        return next(err);
    }
}

async function updateGroupIngredient(req, res, next) {
    try {
        const { id, groupId, ingredientId } = req.params;
        const recipe = await Recipe.findById(id);
        const group = recipe.groups.id(groupId);
        const ingredient = group.ingredients.id(ingredientId);

        // Update the ingredient properties
        ingredient.quantity = req.body.quantity;
        ingredient.measurement = req.body.measurement;
        ingredient.content = req.body.content;

        await recipe.save();

        res.redirect(`/recipes/${id}`);
    } catch (err) {
        return next(err);
    }
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