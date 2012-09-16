var extend = require('node-extend');
var Aggre = require('../lib/Aggre');
var Repository = require('../lib/Repository');
var EventStore = require('../lib/EventStore');
var Store = require('../lib/stores/memory');
var Event = require('../lib/Event')
var store = new Store('Bill');
var es = new EventStore('Bill',store);


function User(){

	var self = this;
	this._data.name = '';

	this.on('changename',function(name){
		console.log(self._data.name);		
	});
}

User.create = function(){
	var u = new this();
	u._data.id = 'id01';
	return u;
}

User.prototype = {

	updateData : function(event,data){
	switch(event.name){
		case 'changename':
			data.name = event.data;
		break;
	}
	},

	changeName: function(name){
		var e = ['changename',name]
		this.publish(e);
	}

}

var M = extend(User,Aggre);
var r = new Repository(M,es);
r.create(function(){
	r.findById('id01',function(mm,next){
		mm.changeName('bright');
		next();
	});
});




