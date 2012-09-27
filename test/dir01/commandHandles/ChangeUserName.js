module.exports = function ChangeUserName(cmd,callback){
	this.domain.repo('User').get(cmd.id,function(err,user,next){

		next();
		if(err){
			callback(err);
		}else if(!user){
			callback(new Error('no have.'))	
		}else{
			user.changeName(cmd.name);
		}

	})
}
