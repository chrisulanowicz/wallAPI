module.exports = function(){
	return {
		index: function(req, res){
			res.json({ message: "Welcome to the Challenge (aka Wall) API"});
		}
	}
}();