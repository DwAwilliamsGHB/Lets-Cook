const Recipe = require("../models/recipe");

module.exports = {
  index,
 
};

function index(req, res) {
  Recipe.find({}, function (err, recipes) {
    res.render("recipes/index", { recipes });
  });
}
