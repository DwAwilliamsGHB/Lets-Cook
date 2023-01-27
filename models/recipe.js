const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recipeSchema = new Schema({
  dishName: {
    type: String,
    required: true
  },
  course: {
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
  serving: {
    type: Number,
    default: 2
  },
  origin: [{
    type: Schema.Types.ObjectId,
    ref: 'Cuisine'
  }],
  haveMade: {type: Boolean, default: false},
  reviews: [reviewSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model("Recipe", recipeSchema);