module.exports = Test;

function Test(){

}

Test.prototype = {

	changeName:function(name){
		var e = ['change name',name];	
		this.publish(e);
	},
	

	$updateState:function(){
		this.on('change name',function(name){
			this.data('name',name);	
		})	
	}		

}

Test.findByName = function(){}
