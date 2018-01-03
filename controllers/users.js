var mongoose = require("mongoose");
var User = mongoose.model("User");
mongoose.Promise = global.Promise;

module.exports = function(){
	return {
		index: function(req, res){
			// get all users with all fields except password with pagination
			var pageNumber = req.query.page;
			User.paginate({}, { select: '_id name email username', lean: true, page: pageNumber, limit: 5 }, function(err, users){
				if(err){
					res.status(418).json(err.message);
				}
				else{
					res.json(users.docs);
				}
			})
		},
		// function will be called upon registration of a new user and automatically logged in
		create: function(req, res){
			var newUser = new User(req.body);
			newUser.save(function(err, user){
				if(err){
					res.status(422).json(err.message);
				}
				else{
					req.session.loggedUser = user._id;
					res.json({ message: "Successfully Registered and Logged In" });
				}
			});
		},
		show: function(req, res){
			// instead of multiple routes for different unique descriptors
			// I'm using just one route param and using regex to determine if its an email, username or ObjectId
			// To avoid potential issue would need to validate that username can't be formatted like an ObjectId (although unlikely)

			var str = req.params.descriptor; // store route parameter
			var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{1,}))$/;
			var objectIdRegex = /^[a-f\d]{24}$/i;
			var searchKey; // will be used to store key for mongoose search

			if(str.match(emailRegex)){
				searchKey = "email";
			}
			else if(str.match(objectIdRegex)){
				searchKey = "_id";
			}
			else{
				searchKey = "username";
			}

			// have to build out query for findOne in single variable for mongoose 'findOne' method
			var query = {}; 
			query[searchKey] = str;

			User.findOne(query, "_id name username email", function(err, user){
				if(err){
					res.status(418).json(err.message);
				}
				else if(user == null){
					res.json({ message: "User not found" });
				}
				else{
					res.json(user);
				}
			})
		},
		// update will only work on loggedin user
		update: function(req, res){

			// Fetch user object, manually change any updated fields and save
			// Used this method instead of mongoose .update because .update skips any .pre methods (so if password was changed it wouldn't get hashed)
			User.findById(req.session.loggedUser, function(err, user){
				if(err){
					res.status(418).json(err.message);
				}
				else if(user == null){
					res.json({ message: "User not found - Make sure you are logged in"});
				}
				else{

					// since any combination of fields can be updated need to check which ones user inputted
					// and only overwrite those fields
					if(req.body.name){
						user.name = req.body.name;
					}
					if(req.body.username){
						user.username = req.body.username;
					}
					if(req.body.email){
						user.email = req.body.email;
					}
					if(req.body.password){
						user.password = req.body.password;
					}
					// need callback inside of save since validations apply so there may be errors
					user.save(function(err, data){
						if(err){
							res.status(418).json(err.message);
						}
						else{
							res.json({ message: "User succesfully updated" });
						}
					});
				}
			})

		},
		// can only delete logged in user
		delete: function(req, res){
			User.remove({_id: req.session.loggedUser}, function(err, result){
				if(err){
					res.status(418).json(err.message);
				}
				else if(result.result.n === 0){
					res.json({ message: "User not found - Make sure you are logged in" });
				}
				else{
					res.json({ message: "You have been deleted from the database"});
				}
			})
		},
		login: function(req, res){
			// find user by username
			var user = User.findOne({username: req.body.username}, function(err, user){
				// check if a user is found
				if(user == null){
					res.status(418).json({message:"Invalid Credentials"});
				}
				// verify password match if user found and log in if true
				else if(user && user.validPassword(req.body.password)){
					req.session.loggedUser = user._id;
					res.json({message: "Successfully Logged In"});
					
				}
				else{
					res.status(418).json({ message:"Invalid Credentials" });
				}
			});
		},
		logout: function(req, res){
			req.session.destroy(function(){
				res.json({ message: "Successfully Logged Out"});
			})
		}
	}
}();