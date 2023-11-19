const Recipe = require("../models/recipe");
const Cuisine = require("../models/cuisine");
const ingredientGroup = require("../models/ingredientGroup");
const stepGroup = require("../models/stepGroup");

module.exports = {
  index,
  show,
  new: newRecipe,
  create,
  edit,
  update,
  confirmDelete,
  delete: deleteRecipe
};

async function index(req, res) {
  try {
    // Fetch all recipes and populate the 'cuisine' field with cuisine data
    const recipes = await Recipe.find().populate('cuisine').exec();
    res.render('recipes/index', { recipes, title: 'All Recipes' }); // Make sure to pass the 'title' option here
  } catch (error) {
    // Handle any potential errors
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}

function show(req, res) {
  Recipe.findById(req.params.id)
    .populate("cuisine")
    .populate("ingredientGroups")
    .populate("stepGroups") 
    .exec(async function (err, recipe) {
      if (err || !recipe) {
        return res.status(404).json({ message: 'Recipe not found' });
      }

      const ingredientGroups = await ingredientGroup.find({ recipe: recipe._id }).exec();
      const stepGroups = await stepGroup.find({ recipe: recipe._id }).exec();

      res.render("recipes/show", { title: recipe.dishName, recipe, ingredientGroups, stepGroups });
    });
}

function newRecipe(req, res) {
  Cuisine.find({}, function (err, cuisines) {
    if (err) {
      // Handle error
    }
    res.render("recipes/new", { title: "Add Recipe", cuisines });
  });
}

function create(req, res) {
  req.body.haveMade = !!req.body.haveMade;
  for (let key in req.body) {
    if (req.body[key] === "") delete req.body[key];
  }
  const cuisineId = req.body.cuisine;
  Cuisine.findById(cuisineId, function (err, cuisine) {
    if (err) {
      // Handle error
    }
    const recipe = new Recipe(req.body);
    recipe.cuisine = cuisine; 
    recipe.save(function (err) {
      if (err) {
        // Handle error
      }
      console.log(recipe);
      res.redirect(`/recipes/${recipe._id}`);
    });
  });
}

function edit(req, res) {
  Recipe.findById(req.params.id)
    .populate("cuisine")
    .populate("ingredientGroups")
    .populate("stepGroups") 
    .exec(async function (err, recipe) {
      if (err || !recipe) {
        return res.status(404).json({ message: 'Recipe not found' });
      }

      const ingredientGroups = await ingredientGroup.find({ recipe: recipe._id }).exec();
      const stepGroups = await stepGroup.find({ recipe: recipe._id }).exec();

      Cuisine.find({}, function (err, cuisines) {
        if (err) {
          // Handle error
        }
        res.render('recipes/edit', {
          title: 'Edit Recipe',
          recipe,
          cuisines,
          ingredientGroups,
          stepGroups
        });
      });
    });
}

function update(req, res) {
  Recipe.findById(req.params.id, function (err, recipe) {
    if (err || !recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
  
    recipe.dishName = req.body.dishName;
    recipe.dishType = req.body.dishType;
    recipe.serving = req.body.serving;
    recipe.prepTime = req.body.prepTime;
    recipe.cookTime = req.body.cookTime;
    recipe.cuisine = req.body.cuisine;
    recipe.haveMade = !!req.body.haveMade;
  
    recipe.save(function (err) {
      if (err) {
        // Handle error
      }
  
      res.redirect(`/recipes/${recipe._id}`);
    });
  });
}

function confirmDelete(req, res) {
  Recipe.findById(req.params.id)
    .populate("cuisine")
    .exec(function (err, recipe) {
      if (err || !recipe) {
        return res.status(404).json({ message: 'Recipe not found' });
      }
      res.render('recipes/confirmDelete', {
        title: 'Confirm Delete',
        recipe
      });
    });
}

function deleteRecipe(req, res) {
  Recipe.findByIdAndDelete(req.params.id, function (err) {
    if (err) {
      // Handle error
    }
    res.redirect('/recipes');
  });
}