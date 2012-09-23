
/* database interface, create / update / remove  */

function DB(){

}

DB.prototype = {

	/*
		callback(err).
	*/
	create:function(id,data,callback){

	}

	/*
		callback(err,data).
	*/
	update:function(id,data,callback){

	}

	/*
		callback(err);
	*/
	remove:function(id,callback){

	}
	
	/*
		
	*/
	query:function(){
		// 返回一个Query对象，具体操作更加DB驱动
	}
	
};