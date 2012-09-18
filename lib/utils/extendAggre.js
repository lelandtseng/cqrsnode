var Aggre = require('../Aggre');
var extend = require('node-extend');

module.exports = function extendAggre(Aggres,cqrs){
	for(var k in Aggres){
		Aggres[k] = extend(Aggres[k],Aggre);
	}
}