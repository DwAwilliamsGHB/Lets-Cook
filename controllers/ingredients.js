const Recipe = require('../models/recipe')
const Ingredient = require('../models/recipe')

module.exports = {
    create,
    edit,
    update,
    delete: deleteIngredient
}

function create(req, res) {
    Recipe.findById(req.params.id, function(err, recipe) {

        req.body.user = req.user._id
        req.body.userName = req.user.name
        req.body.userAvatar = req.user.avatar

        recipe.ingredients.push(req.body)
        recipe.save(function(err) {
            res.redirect(`/recipes/${recipe._id}`)
        })
    })
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