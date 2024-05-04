const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ingredientSchema = new Schema({
    quantity: {
      type: String,
      default: 0,
    },
    measurement: {
      type: String,
      enum: ['Pinch', 'Dash', 'Teaspoon', 'Tablespoon', 'Ounce', 'Pound', 'Fluid Ounce', 'Cup', 'Pint', 'Quart', 'Gallon'],
    },
    content: {
      type: String,
      required: true
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    userName: String,
    userAvatar: String
}, {
    timestamps: true
})

module.exports = mongoose.model("Ingredient", ingredientSchema);