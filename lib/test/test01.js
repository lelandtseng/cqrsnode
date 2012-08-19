var R = require('../Repository');
var Event = require('../Event');
var util = require('util');
var Aggre = require('../Aggre');

function MyA(id){
	Aggre.call(this,id)	
	var self = this;
	this._data.name = '';
	this.on('changeName',function(name){
		self._data.name = name;				
		console.log('------------------------');
		console.log(name);
		console.log('------------------------');
	})
}

util.inherits(MyA,Aggre);

MyA.prototype.changeName = function(name){
	var e = new Event('changeName',name);
	this.publish(e);		
}

MyA.create = function(){
	var self = this;
	return new self('id001')
}

var myR = new R(MyA);



setTimeout(function(){

myR.findById('id001',function(r){
	console.log(r)
})
		
/*
myR.create(function(aggre){
	console.log(aggre)	
})
*/

},2000);




