var mongoose = require("mongoose");
var path = require("path");
var fs = require("fs");
mongoose.Promise = global.Promise;

// connect to mongoDB
mongoose.connect("mongodb://localhost/ulanowicz-test", { useMongoClient: true, promiseLibrary: global.Promise });


// dynamically require all model files
var models_path = path.join(__dirname, '/../../models');

fs.readdirSync(models_path).forEach(function(file){
	if(file.indexOf('.js')>0){
		require(models_path + '/' + file);
	}
})