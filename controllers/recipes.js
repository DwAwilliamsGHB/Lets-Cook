const Recipe = require("../models/recipe");
const Cuisine = require('../models/cuisine')

module.exports = {
  index,
  show,
  new: newRecipe,
  create,

 
};

function index(req, res) {
  Recipe.find({}, function (err, recipes) {
    res.render("recipes/index", { title: 'Recipes', recipes });
  });
}

function show(req, res) {
  Recipe.findById(req.params.id)
    .populate("origin")
    .exec(function (err, recipe) {
      Cuisine.find({ _id: { $nin: recipe.origin } }, function (err, cuisines) {
        console.log(recipe);
        res.render("recipes/show", { title: "Instructions", recipe, cuisines });
      });
    });
}

function newRecipe(req, res) {
  res.render("recipes/new", { title: "Add Recipe" });
}

function create(req, res) {
  req.body.haveMade = !!req.body.haveMade;
  for (let key in req.body) {
    if (req.body[key] === "") delete req.body[key];
  }

  const recipe = new Recipe(req.body);
  recipe.save(function (err) {
    if (err) return res.redirect("/recipes/new");
    console.log(recipe);
    res.redirect(`/recipes/${recipe._id}`);
  });
}