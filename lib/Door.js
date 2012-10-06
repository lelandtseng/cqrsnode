module.exports = Door;
// it is domain door, outside only use it proxy use domain.
//@param queryBus_ is a QueryBus
function Door(queryBus_,commandBus_){
	var queryBus = queryBus_;	
	var commandBus = commandBus_;

	// cqrs - Q =  Query.
	// query is a Array type.
	//   var query01 = ['queryName',arg0,arg1... ];
	//
	//   var domain = new Domain ...
	//   var query01 = ...
	//   domain.door.q(query01,callback)
	this.q = function(query,callback){
		queryBus.execute(query,callback);		
	}

	//@see this.q
	// cqrs - C = Command
	this.exec = function(cmd,callback){
		commandBus.execute(cmd,callback);	
	}

}
