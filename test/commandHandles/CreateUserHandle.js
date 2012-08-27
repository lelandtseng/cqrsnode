var cqrs = require('../..');
module.exports = function(command,cb){
	cqrs.repos.User.create(function(err,u){
		console.log('======='+u)			
	});	
}
