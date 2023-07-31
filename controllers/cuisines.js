const Cuisine = require('../models/cuisine');
const Recipe = require('../models/recipe');

module.exports = {
  show,
  new: newCuisine,
  create,
  edit,
  update,
  confirmDelete,
  delete: deleteCuisine
};

function show(req, res) {
  Cuisine.findById(req.params.id, function (err, cuisine) {
    if (err || !cuisine) {
      return res.status(404).json({ message: 'Cuisine not found' });
    }
    res.render('cuisines/show', { title: cuisine.name, cuisine });
  });
}

function create(req, res) {
  Cuisine.create(req.body, function (err, cuisine) {
    res.redirect('/cuisines/index');
  });
}

function newCuisine(req, res) {
  Cuisine.find({})
    .sort('name')
    .exec(function (err, cuisines) {
      res.render('cuisines/index', {
        title: 'Cuisines',
        cuisines
      });
    });
}

function edit(req, res) {
  Cuisine.findById(req.params.id, (err, cuisine) => {
    if (err || !cuisine) {
      return res.status(404).json({ message: 'Cuisine not found' });
    }
    res.render('cuisines/edit', { title: 'Edit Cuisine', cuisine });
  });
}

function update(req, res) {
  Cuisine.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name }, 
    { new: true },
    (err, cuisine) => {
      if (err || !cuisine) {
        return res.status(404).json({ message: 'Cuisine not found' });
      }
      res.redirect(`/cuisines/${cuisine._id}`);
    }
  );
}

function confirmDelete(req, res) {
  Cuisine.findById(req.params.id, (err, cuisine) => {
    if (err || !cuisine) {
      return res.status(404).json({ message: 'Cuisine not found' });
    }
    res.render('cuisines/confirmDelete', { title: 'Confirm Delete', cuisine });
  });
}

function deleteCuisine(req, res) {
  Cuisine.findByIdAndRemove(req.params.id, function (err, cuisine) {
    if (err) {
      // Handle error
    }
    res.redirect('/cuisines/index');
  });
}