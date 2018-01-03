var mongoose = require("mongoose");
var Comment = mongoose.model("Comment");
var User = mongoose.model("User");
var Post = mongoose.model("Post");
mongoose.Promise = global.Promise;

module.exports = function(){
	return {
		indexByPost: function(req, res){
			Comment.find({_post: req.params.postId}, function(err, comments){
				if(err){
					res.status(418).json(err.message);
				}
				else if(comments.length == 0){
					res.json({ message: "No comments for this post" })
				}
				else{
					res.json(comments);
				}
			})
		},
		indexByEmail: function(req, res){
			Comment.find({email: req.params.email}, function(err, comments){
				if(err){
					res.status(418).json(err.message);
				}
				else if(comments.length == 0){
					res.json({ message: "No comments by this user" })
				}
				else{
					res.json(comments);
				}
			})
		},
		create: function(req, res){
			User.findOne({_id: req.session.loggedUser}, function(err, user){
				if(err){
					res.status(418).json(err.message);
				}
				else if(user == null){
					res.json({ message: "User not found - Make sure you are logged in to comment" });
				}
				else{
					var newComment = new Comment(req.body);
					newComment.name = user.name;
					newComment.email = user.email;
					newComment.save(function(err, data){
						if(err){
							res.status(422).json(err.message);
						}
						else{
							res.json({ message: "Successfully Created Comment" });
						}
					});
				}
			})
		},
		show: function(req, res){
			Comment.findOne({_id: req.params.id}, function(err, comment){
				if(err){
					res.status(418).json(err.message);
				}
				else if(comment == null){
					res.json({ message: "Comment not found" });
				}
				else{
					res.json(comment)
				}
			})
		},
		update: function(req, res){
			User.findOne({_id: req.session.loggedUser}, function(err, user){
				if(err){
					res.status(418).json(err.message);
				}
				else if(user == null){
					res.json({ message: "User not found - Make sure you are logged in to edit your comment" });
				}
				else{
					Comment.findOne({_id: req.params.id}, function(err, commentToUpdate){
						if(err){
							res.status(418).json(err.message);
						}
						else if(commentToUpdate == null){
							res.json({ message: "Comment not found" });
						}
						else{
							if(commentToUpdate.email == user.email){
								commentToUpdate.body = req.body.body;
								// need callback inside of save since validations apply so there may be errors
								commentToUpdate.save(function(err, data){
									if(err){
										res.status(418).json(err.message);
									}
									else{
										res.json({ message: "Comment succesfully updated" });
									}
								});
							}
							else{
								res.status(418).json({ message: "Can't update other users comments'" });
							}
						}
					})
				}
			})
		},
		delete: function(req, res){
			User.findOne({_id: req.session.loggedUser}, function(err, user){
				if(err){
					res.status(418).json(err.message);
				}
				else if(user == null){
					res.json({ message: "User not found - Make sure you are logged in to delete comment" });
				}
				else{
					Comment.findOne({_id: req.params.id}, function(err, comment){
						if(err){
							res.status(418).json(err.message);
						}
						else if(comment == null){
							res.status(418).json({ message: "Comment not found" });
						}
						else{
							Post.findOne({_id: comment._post}, function(err, post){
								if(err){
									res.status(418).json(err.message);
								}
								else if(post == null){
									res.json({ message: "Post for this comment not found" });
								}
								else{
									if(comment.email == user.email || post._user == user._id){
										comment.remove(function(err, result){
											if(err){
												res.status(418).json(err.message);
											}
											else{
												res.json("Comment successfully deleted");
											}
										})
									}
									else{
										res.status(418).json({ message: "Can only delete your own comments or comments on your own posts" });
									}
								}
							})
						}
					})
				}
			})
		}
	}
}();