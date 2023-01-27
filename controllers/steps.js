const Recipe = require('../models/recipe')

module.exports = {
    create,
    delete: deleteStep
}

function create(req, res) {
    Recipe.findById(req.params.id, function(err, recipe) {

        req.body.user = req.user._id
        req.body.userName = req.user.name
        req.body.userAvatar = req.user.avatar

        recipe.step.push(req.body)
        recipe.save(function(err) {
            res.redirect(`/recipes/${recipe._id}`)
        })
    })
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