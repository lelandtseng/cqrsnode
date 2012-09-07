module.exports = function ChangeUserNameHandle(command,cb){
	this.cqrs.repos.User.findById(command.id,function(u,next){
		u.changeName(command.name);
		next();
	})
}

