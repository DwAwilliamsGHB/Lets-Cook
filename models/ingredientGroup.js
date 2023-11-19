const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Ingredient = require("./ingredient");


const ingredientGroupSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  ingredients: [Ingredient.schema],
  userName: String,
  userAvatar: String
}, {
  timestamps: true,
});

module.exports = mongoose.model("ingredientGroup", ingredientGroupSchema);
