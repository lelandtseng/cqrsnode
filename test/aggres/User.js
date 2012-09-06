function User(){
	var self = this;
	this.on('changeName',function(name){
		self._data.name = name;				
	})
}

User.create = function(){
	var u = new User();
	return u;
}

User.prototype = {

 changeName : function(name){
 	 var e = ['changeName',name];
	 this.publish(e);
 }

}
module.exports = User;