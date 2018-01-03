var mongoose = require("mongoose");
var mongoosePaginate = require("mongoose-paginate");
mongoose.Promise = global.Promise;

var PostSchema = new mongoose.Schema({

	_user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	},
	title: {
		type: String,
		required: true
	},
	body: {
		type: String,
		required: true
	}

});


PostSchema.plugin(mongoosePaginate);

mongoose.model('Post', PostSchema);