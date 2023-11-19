const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Ingredient = require("./ingredient");
const Step = require("./step");
const ingredientGroup = require("./ingredientGroup");
const stepGroup = require('./stepGroup')

const recipeSchema = new Schema({
  dishName: {
    type: String,
    required: true
  },
  dishType: {
    type: String,
    enum: ['Appetizer', 'Main Dish', 'Side Dish', 'Dessert', 'Full Course']
  },
  prepTime: {
    type: Number,
    default: 0
  },
  cookTime: {
    type: Number,
    default: 0
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
  ingredientGroups: [ingredientGroup.schema],
  ingredients: [Ingredient.schema],
  stepGroups: [stepGroup.schema],
  steps: [Step.schema]
}, {
  timestamps: true
});

// Define a virtual property for prep time
recipeSchema.virtual('formattedPrepTime').get(function() {
  return formatTime(this.prepTime);
});

// Define a virtual property for cook time
recipeSchema.virtual('formattedCookTime').get(function() {
  return formatTime(this.cookTime);
});

// Function to format time in hours and minutes
function formatTime(timeInMinutes) {
  if (timeInMinutes === 0) {
    return '0 minutes';
  }

  // Calculate hours and minutes
  const hours = Math.floor(timeInMinutes / 60);
  const minutes = timeInMinutes % 60;

  // Format the result
  let formattedTime = '';
  if (hours > 0) {
    formattedTime += `${hours} hour${hours > 1 ? 's' : ''}`;
  }
  if (minutes > 0) {
    formattedTime += ` ${minutes} minute${minutes > 1 ? 's' : ''}`;
  }

  return formattedTime.trim();
}

// Define a virtual property for totalTime
recipeSchema.virtual('totalTime').get(function() {
  const totalMinutes = this.prepTime + this.cookTime;

  if (totalMinutes === 0) {
    return '0 minutes';
  }

  // Calculate hours and minutes
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  // Format the result
  let totalTimeString = '';
  if (hours > 0) {
    totalTimeString += `${hours} hour${hours > 1 ? 's' : ''}`;
  }
  if (minutes > 0) {
    totalTimeString += ` ${minutes} minute${minutes > 1 ? 's' : ''}`;
  }

  return totalTimeString.trim();
});

module.exports = mongoose.model("Recipe", recipeSchema);