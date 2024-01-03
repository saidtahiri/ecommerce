var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
var app = express();



//import Routes

//var indexRouter = require('./routes/products');
var usersRoute = require('./routes/users');
var productsRoute= require('./routes/products');
var ordersRoute= require('./routes/orders');



app.use(bodyParser.json()); //Handles JSON requests
app.use(bodyParser.urlencoded({ extended: true })); //Handles normal post requests



app.use(cors({
  origin:"*",
  methods:['GET','POST','DELETE','PATCH','PUT'],
  allowedHeaders:'Access-Control-Allow-Origin, Content-Type, Authorization, Origin, X-Requested-With, Accept'
}));

//Use Routes - My API's
app.use('/api/products',productsRoute);
app.use('/api/orders',ordersRoute);
app.use('/api/users',usersRoute);



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');




app.options('*', cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));




//Routes
/* app.use('/', indexRouter);
app.use('/users', usersRouter); */

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
