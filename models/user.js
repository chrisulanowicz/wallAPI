var mongoose = require("mongoose");
var bcrypt = require("bcrypt");
var uniqueValidator = require("mongoose-unique-validator");
var mongoosePaginate = require("mongoose-paginate");
mongoose.Promise = global.Promise;

var UserSchema = new mongoose.Schema({

	email: {
		type: String,
		required: true,
		unique: [true, "Email already registered"]
	},
	password: {
		type: String,
		required: true,
		minlength: [4, "Password must be at least 4 characters"]
	},
	name: {
		type: String,
		required: true
	},
	username: {
		type: String,
		required: true,
		unique: [true, "Username already taken"]
	}

});

UserSchema.plugin(uniqueValidator);
UserSchema.plugin(mongoosePaginate);

UserSchema.methods.generateHash = function(password){
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
}

UserSchema.methods.validPassword = function(password){
	return bcrypt.compareSync(password, this.password);
}

UserSchema.pre('save', function(done){
	if(this.isModified('password')){
		this.password = this.generateHash(this.password);
	}
	done();
})

mongoose.model('User', UserSchema);