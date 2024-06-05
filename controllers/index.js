const Cuisine = require('../models/cuisine');
const Recipe = require('../models/recipe'); 

module.exports = {
  index(req, res, next) {
    // Fetch some data if needed, for example, featured recipes
    Recipe.find({}, (err, recipes) => {
      if (err) return next(err);
      res.render('index', { title: 'Lets Cook', recipes });
    });
  }
};