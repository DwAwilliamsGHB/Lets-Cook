var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const passport = require('passport');
const methodOverride = require('method-override');

require('dotenv').config();
require('./config/database');
require('./config/passport');

var indexRouter = require('./routes/index');
var recipesRouter = require('./routes/recipes');
var ingredientGroupsRouter = require('./routes/ingredientGroups');
var ingredientsRouter = require('./routes/ingredients');
var stepGroupsRouter = require('./routes/stepGroups')
var stepsRouter = require('./routes/steps');
var cuisinesRouter = require('./routes/cuisines');
var storagesRouter = require('./routes/storages');
var equipmentsRouter = require('./routes/equipments');
var notesRouter = require('./routes/notes');
var freezersRouter = require('./routes/freezers');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(methodOverride('_method'))
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true
}))
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize())
app.use(passport.session())

app.use(function(req, res, next) {
  res.locals.user = req.user
  next()
})

app.use('/', indexRouter);
app.use('/recipes', recipesRouter);
app.use('/', ingredientGroupsRouter);
app.use('/', ingredientsRouter);
app.use('/', stepGroupsRouter);
app.use('/', stepsRouter);
app.use('/', cuisinesRouter);
app.use('/', storagesRouter);
app.use('/', equipmentsRouter);
app.use('/', notesRouter);
app.use('/', freezersRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
