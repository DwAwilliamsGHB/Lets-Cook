const Recipe = require('../models/recipe')
const Ingredient = require('../models/recipe')

module.exports = {
    create,
    edit,
    update,
    delete: deleteIngredient
}

function create(req, res) {
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
        const recipe = await Recipe.findOne({'ingredients._id': req.params.id})
        if (!recipe) return res.redirect('/recipes')
        recipe.ingredients.remove(req.params.id)
        await recipe.save()
        res.redirect(`/recipes/${recipe._id}`)
    } catch(err) {
        return next(err)
    }
}