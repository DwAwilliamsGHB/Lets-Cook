const Cuisine = require('../models/cuisine');
const Recipe = require('../models/recipe');

module.exports = {
  new: newCuisine,
  create,
  addToOrigin
};

function create(req, res) {
  Cuisine.create(req.body, function (err, cuisine) {
    res.redirect('/cuisines/new');
  });
}

function newCuisine(req, res) {
  Cuisine.find({})
    //Sort cuisines by their name
    .sort('name')
    .exec(function (err, cuisines) {
      res.render('cuisines/new', {
        title: 'Add Cuisine',
        cuisines
      });
    });
}

function addToOrigin(req, res) {
  Recipe.findById(req.params.id, function(err, recipe) {
    recipe.origin.push(req.body.cuisineId)
    recipe.save(function(err) {
      res.redirect(`/recipes/${recipe._id}`)
    })
  })
}