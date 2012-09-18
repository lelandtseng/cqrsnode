module.exports  =  function CreateUser(cmd,callback){
	this.domain.repo('User').findById('id003',function(user,next){
		user.changeName('brighthas');
		next()
 	});
}
