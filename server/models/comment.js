var mongoose = require("mongoose");
mongoose.Promise = global.Promise;

var CommentSchema = new mongoose.Schema({

	_post: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Post"
	},
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	body: {
		type: String,
		required: true
	}

});

mongoose.model('Comment', CommentSchema);