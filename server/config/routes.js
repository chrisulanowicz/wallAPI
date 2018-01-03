var path = require("path");
var home = require("./../../controllers/home.js");
var users = require("./../../controllers/users.js");
var posts = require("./../../controllers/posts.js");
var comments = require("./../../controllers/comments.js");

module.exports = function(app){

	// root route
	app.get('/', home.index);

	// login and logout Users
	app.post('/users/login', users.login);
	app.get('/users/logout', users.logout);
	// routes for Users
	app.get('/users', users.index);  // get all Users
	app.post('/users', users.create);  // create a new User
	app.get('/users/:descriptor', users.show);  // get User with a unique descriptor
	app.put('/users', users.update);  // edit a User
	app.delete('/users', users.delete);  // delete a Use


	// routes for Posts
	app.get('/posts', posts.index);  // get all Posts
	app.post('/posts', posts.create);  // create a new Post
	app.get('/posts/:id', posts.show); // get a Post by its ID
	app.get('/posts/users/:userId', posts.showByUser);  // get a Post by User ?? Need to ask about this.  User can have many posts so should this be, 'get all posts by User?' ??
	app.get('/posts/comments/:commentId', posts.showByComment); // get a Post by one of its comments id
	app.put('/posts/:id', posts.update); // edit a Post
	app.delete('/posts/:id', posts.delete); // delete a Post

	// routes for Comments
	app.post('/comments', comments.create);  // create a new Comment
	app.get('/comments/:id', comments.show);  // get a Comment by its id
	app.get('/comments/posts/:postId', comments.indexByPost);  // get all Comments belonging to a Post
	app.get('/comments/users/:email', comments.indexByEmail);  // get all Comments by email belonging to a User
	app.put('/comments/:id', comments.update);  // edit a Comment
	app.delete('/comments/:id', comments.delete);  // delete a Comment

}