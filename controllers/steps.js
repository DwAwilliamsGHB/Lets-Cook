const Recipe = require('../models/recipe')

module.exports = {
    create,
    edit,
    update,
    delete: deleteStep
}

function create(req, res) {
    Recipe.findById(req.params.id, function(err, recipe) {

        req.body.user = req.user._id
        req.body.userName = req.user.name
        req.body.userAvatar = req.user.avatar

        recipe.steps.push(req.body)
        recipe.save(function(err) {
            res.redirect(`/recipes/${recipe._id}`)
        })
    })
}

function edit(req, res) {
    Recipe.findOne({ 'steps._id': req.params.stepId }, (err, recipe) => {
        if (err || !recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        const step = recipe.steps.id(req.params.stepId); // Find the specific step by ID
        if (!step) {
            return res.status(404).json({ message: 'Step not found' });
        }
        res.render('steps/edit', { title: 'Edit Step', recipe, step });
    });
}

function update(req, res) {
    Recipe.findOneAndUpdate(
        { 'steps._id': req.params.stepId },
        {
            $set: {
                'steps.$.content': req.body.content
            }
        },
        { new: true },
        (err, recipe) => {
            if (err || !recipe) {
                return res.status(404).json({ message: 'Step not found' });
            }
            res.redirect(`/recipes/${recipe._id}`);
        }
    );
}

async function deleteStep(req, res, next) {
    try {
        const recipe = await Recipe.findOne({'steps._id': req.params.id})
        if (!recipe) return res.redirect('/recipes')
        recipe.steps.remove(req.params.id)
        await recipe.save()
        res.redirect(`/recipes/${recipe._id}`)
    } catch(err) {
        return next(err)
    }
}