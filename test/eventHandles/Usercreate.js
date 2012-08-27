var tiny = require('tiny'); 
module.exports = function(e){
	tiny('dbs/User.db',function(err,db){
			console.log(err)
			console.log(db)
		db.set(e.data.id,e.data,function(err){
			console.log(err);				
		})
	})
}
