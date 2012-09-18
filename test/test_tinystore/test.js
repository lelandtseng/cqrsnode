var TS = require('../../lib/stores/tiny');


var ts = new TS('Testdb');

setTimeout(function(){
	ts.storeEvent({name:'changeName'},function(err,d){
		console.log(err)
				console.log(d)

	})
},1000)