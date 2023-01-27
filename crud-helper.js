require('dotenv').config();
require('./config/database');

/*--- Require the app's Mongoose models ---*/
const Recipe = require('./models/recipe');
const Cuisine = require('./models/cuisine');

/*--- Define Variables to Hold Documents ---*/
let recipe, recipes;
let cuisine, cuisines;

