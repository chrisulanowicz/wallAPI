var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("./server/config/mongoose.js");
var session = require("express-session");
var path = require("path");

mongoose.Promise = global.Promise;

var app = express();

// allows parsing of request body data
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

// setup session
app.set('trust proxy', 1);
app.use(session({
	secret: 'petroCloudExercise',
	resave: false,
	saveUninitialized: true
}));

// connect to db and file containing url routes
require("./server/config/mongoose.js");
var routeSetter = require("./server/config/routes.js")(app);


// start server
app.listen(8000, function(){
	console.log("server running on port 8000");
})