const Recipe = require('../models/recipe');

module.exports = {
  create,
  groupStepCreate,
  edit,
  groupStepEdit,
  update,
  groupStepUpdate,
  delete: stepDelete,
};

function create(req, res) {
  Recipe.findById(req.params.id, function (err, recipe) {
    if (err || !recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    req.body.user = req.user._id;
    req.body.userName = req.user.name;
    req.body.userAvatar = req.user.avatar;

    recipe.steps.push(req.body);
    recipe.save(function (err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to add step to recipe' });
      }
      res.redirect(`/recipes/${recipe._id}`);
    });
  });
}

function groupStepCreate(req, res) {
  Recipe.findOne({ _id: req.params.id, 'stepGroups._id': req.params.stepGroupId }, function (err, recipe) {
    if (err || !recipe) {
      return res.status(404).json({ message: 'Recipe or Step group not found' });
    }

    const step = {
      user: req.user._id,
      userName: req.user.name,
      userAvatar: req.user.avatar,
      content: req.body.content,
    };

    const stepGroup = recipe.stepGroups.id(req.params.stepGroupId);
    stepGroup.steps.push(step);

    recipe.save(function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to add step to group' });
      }
      res.redirect(`/recipes/${recipe._id}`);
    });
  });
}

function edit(req, res) {
  Recipe.findOne({ 'steps._id': req.params.stepId }, (err, recipe) => {
    if (err || !recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    const step = recipe.steps.id(req.params.stepId);
    if (!step) {
      return res.status(404).json({ message: 'Step not found' });
    }
    if (!step.user.equals(req.user._id)) {
      return res.status(403).send('Forbidden');
    }
    res.render('steps/edit', { title: 'Edit Step', recipe, step });
  });
}

function groupStepEdit(req, res, next) {
  Recipe.findOne({ 'stepGroups._id': req.params.stepGroupId }, (err, recipe) => {
    if (err || !recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    const stepGroup = recipe.stepGroups.id(req.params.stepGroupId);
    const step = stepGroup.steps.id(req.params.stepId);

    if (!step.user.equals(req.user._id)) {
      return res.status(403).send('Forbidden');
    }

    res.render('groupSteps/edit', { title: 'Edit Step', recipe, stepGroup, step });
  });
}

function update(req, res) {
  Recipe.findOne({ 'steps._id': req.params.stepId }, (err, recipe) => {
    if (err || !recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    const step = recipe.steps.id(req.params.stepId);
    if (!step) {
      return res.status(404).json({ message: 'Step not found' });
    }
    if (!step.user.equals(req.user._id)) {
      return res.status(403).send('Forbidden');
    }
    step.content = req.body.content;

    recipe.save(function (err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to update step' });
      }
      res.redirect(`/recipes/${recipe._id}`);
    });
  });
}

async function groupStepUpdate(req, res, next) {
  try {
    const { id, stepGroupId, stepId } = req.params;
    const recipe = await Recipe.findById(id);
    const stepGroup = recipe.stepGroups.id(stepGroupId);
    const step = stepGroup.steps.id(stepId);

    if (!step.user.equals(req.user._id)) {
      return res.status(403).send('Forbidden');
    }

    step.content = req.body.content;

    await recipe.save();

    res.redirect(`/recipes/${id}`);
  } catch (err) {
    return next(err);
  }
}

async function stepDelete(req, res, next) {
  try {
    const { id, stepGroupId, stepId } = req.params;
    let recipe;

    if (stepGroupId) {
      // If stepGroupId is present, it's a groupStep deletion
      recipe = await Recipe.findOne({ 'stepGroups._id': stepGroupId });
      if (!recipe) return res.redirect('/recipes');
      const stepGroup = recipe.stepGroups.id(stepGroupId);
      const step = stepGroup.steps.id(stepId);
      if (!step.user.equals(req.user._id)) {
        return res.status(403).send('Forbidden');
      }
      stepGroup.steps.remove(stepId);
    } else {
      // Otherwise, it's a regular step deletion
      recipe = await Recipe.findOne({ 'steps._id': id });
      if (!recipe) return res.redirect('/recipes');
      const step = recipe.steps.id(id);
      if (!step.user.equals(req.user._id)) {
        return res.status(403).send('Forbidden');
      }
      recipe.steps.remove(id);
    }

    await recipe.save();
    res.redirect(`/recipes/${recipe._id}`);
  } catch (err) {
    return next(err);
  }
}
