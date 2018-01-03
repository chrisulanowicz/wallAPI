var mongoose = require("mongoose");
var Post = mongoose.model("Post");
var Comment = mongoose.model("Comment");
mongoose.Promise = global.Promise;

module.exports = function(){
	return {
		index: function(req,res){
			var pageNumber = req.query.page;
			Post.paginate({}, { lean: true, page: pageNumber, limit: 5 }, function(err, posts){
				if(err){
					res.status(418).json(err.message);
				}
				else{
					res.json(posts.docs);
				}
			})
		},
		create: function(req, res){
			var newPost = new Post(req.body);
			newPost._user = req.session.loggedUser;
			newPost.save(function(err, data){
				if(err){
					res.status(422).json(err.message);
				}
				else{
					res.json({ message: "Successfully Created Post" });
				}
			});
		},
		show: function(req, res){
			Post.findOne({_id: req.params.id}, function(err,post){
				if(err){
					res.status(418).json(err.message);
				}
				else if(post == null){
					res.json({ message: "Post not found"} );
				}
				else{
					res.json(post);	
				}
			})
		},
		showByUser: function(req, res){
			Post.findOne({_user: req.params.userId}, function(err, post){
				if(err){
					res.status(418).json(err.message);
				}
				else if(post == null){
					res.json({ message: "Post not found"} );
				}
				else{
					res.json(post);	
				}
			})
		},
		showByComment: function(req, res){
			Comment.findOne({_id: req.params.commentId}, function(err, comment){
				if(err){
					res.status(418).json(err.message);
				}
				else if(comment == null){
					res.json({ message: "Comment not found" });
				}
				else{
					Post.findOne({_id: comment._post}, function(err, post){
						if(err){
							res.status(418).json(err.message);
						}
						else if(post == null){
							res.json({ message: "Post not found" });
						}
						else{
							res.json(post);
						}
					})
				}
			})
		},
		update: function(req, res){
			Post.findOne({_id: req.params.id}, function(err, postToUpdate){
				if(err){
					res.status(418).json(err.message);
				}
				else if(postToUpdate == null){
					res.json({ message: "Post not found" });
				}
				else{
					if(postToUpdate._user == req.session.loggedUser){
						if(req.body.title){
							postToUpdate.title = req.body.title;
						}
						if(req.body.body){
							postToUpdate.body = req.body.body;
						}
						// need callback inside of save since validations apply so there may be errors
						postToUpdate.save(function(err, data){
							if(err){
								res.status(418).json(err.message);
							}
							else{
								res.json({ message: "Post succesfully updated" });
							}
						});
					}
					else{
						res.status(418).json({ message: "Can't update other users posts'" });
					}
				}
			})
		},
		delete: function(req, res){
			Post.findOne({_id: req.params.id}, function(err, post){
				if(err){
					res.status(418).json(err.message);
				}
				else if(post == null){
					res.json({ message: "Post not found" });
				}
				else{
					if(post._user == req.session.loggedUser){
						post.remove(function(err, result){
							if(err){
								res.status(418).json(err.message);
							}
							else{
								res.json("Post successfully deleted");
							}
						})
					}
					else{
						res.status(418).json({ message: "Can only delete your own posts" });
					}
				}
			})
		}
	}
}();