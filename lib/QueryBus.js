module.exports = QueryBus;

function QueryBus(QAggres){

	var handles = {};

	var Aggres = QAggres;
	var proxy = {
		aggre:function(AggreTypeName){
			return Aggres[AggreTypeName]	
		}
	}

	this.bind = function(queryName,handle){
		handles[queryName] = handle;
	}

	this.execute = function(queryName,query,callback){
		console.log(arguments)
		handles[queryName].call(proxy,query,callback);
	}
	
}

