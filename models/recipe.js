const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Ingredient = require("./ingredient");
const Step = require("./step");
const Group = require("./group");

const recipeSchema = new Schema({
  dishName: {
    type: String,
    required: true
  },
  foodType: {
    type: String,
    enum: ['Appetizer', 'Main Dish', 'Side Dish', 'Dessert', 'Full Course']
  },
  prepTime: {
    type: Number,
    default: 1
  },
  cookTime: {
    type: Number,
    default: 1
  },
  totalTime: {
    type: Number,
    default: 1
  },
  serving: {
    type: Number,
    default: 2
  },
  cuisine: {
    type: Schema.Types.ObjectId,
    ref: 'Cuisine',
  },
  haveMade: {
    type: Boolean, 
    default: false
  },
  groups: [Group.schema],
  ingredients: [Ingredient.schema],
  steps: [Step.schema]
}, {
  timestamps: true
});

module.exports = mongoose.model("Recipe", recipeSchema);