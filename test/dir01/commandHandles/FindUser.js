module.exports = function FindUser(cmd,callback){
	this.domain.repo('User').get(cmd.id,callback);
}
