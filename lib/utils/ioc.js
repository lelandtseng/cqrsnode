module.exports = function(Funs,cqrs){
	for(var k in Funs){
		Funs[k].prototype.cqrs = cqrs;
	}
}