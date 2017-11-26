"use strict";

var path = require("path");
var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var handlebars = require("express-handlebars").create(
  {  
    extname         : '.hbs',
    defaultLayout   : 'main',
    layoutsDir      : 'app/views/layouts',
    helpers         : require("./app/utils/helpers.js")

  });


var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scrape"

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {
  useMongoClient: true
});

let app = express();


// set up handlebars view engine
app.engine('hbs', handlebars.engine);
app.set('view engine', 'hbs');
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'app/views'))

// Static files
app.use(express.static(__dirname + '/app/public'));


// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// Import routes
require("./app/controllers/comments.js")(app);
require("./app/controllers/main.js")(app);


app.listen(app.get('port'), function() {
  console.log(`App listening on PORT ${app.get('port')}`);
});
