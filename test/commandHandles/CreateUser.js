module.exports = function(command,cb){
	this.cqrs.repos.User.create(function(err,u){
		console.log('======='+u)			
	});	
}
