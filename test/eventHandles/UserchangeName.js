var tiny = require('tiny'); 
function UserchangeName(e){
	tiny('dbs/User.db',function(err,db){
		db.update(e.aggreId,{name:e.data},function(err){
			console.log(err)	
		})	
	})
}

module.exports = UserchangeName;
