var cqrs = require('../..');
module.exports = function ChangeUserNameHandle(command,cb){
	cqrs.repos.User.findById(command.id,function(u,next){
		u.changeName(command.name);
	next();
	})
}


