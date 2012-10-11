
module.exports = Test;

function Test(info){		
}

Test.prototype  = {
	$updateState:function(){
		this.on('updateName',function(name){
			this.data('name',name)	
		})	
	},

	updateName:function(name){
		var e = ['updateName',name]	
		this.publish(e)
	}
}
