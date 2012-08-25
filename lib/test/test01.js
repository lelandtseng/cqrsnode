console.log(require('lockmethod').Position)
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
		console.log(name);
	})
	this.on('changeAge',function(age){
		self._data.age = age;
		console.log('my age is '+age)	
	});
}

util.inherits(MyA,Aggre);

MyA.prototype.changeName = function(name){
	var e = new Event('changeName',name);
	this.publish(e);		
}

MyA.prototype.changeAge = function(age){
	var e = new Event('changeAge',age);
	this.publish(e);		
}

MyA.create = function(){
	var self = this;
	return new self('id001')
}

var myR = new R(MyA);



setTimeout(function(){
myR.findById('id001',function(r,next){
	r.changeName("birhths")
	r.changeAge(233);
	next();
})
/*		
myR.create(function(aggre){
	console.log(aggre)
})
*/

},2000);




