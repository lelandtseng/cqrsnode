module.exports = {

	'createTest':function(cmd,callback){
		var T = this.aggre('Test');	
		var t = new T()
		callback(null,t.id);
	},

	'updateName':function(cmd , callback){
		this.aggre('Test').get(cmd.id,function(err,test,next){
			  test.changeName('jfldsjflsd')	
				next();
				callback();
		})	 
	}
}
