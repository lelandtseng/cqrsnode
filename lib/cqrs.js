module.exports = {
	
	init:function(_options){

		if(!isInit){
		options = _options; 		 

		load('/aggres',aggres);
		aggresExtend();
		load('/eventHandles',eventHandles);
		load('/commands',commands);
		load('/commandHandles',commandHandles);

		bingEventHandle();
		bingCommandHandle();
		bingRepo();

		commandBus._repo.cqrs = this;
		

		isInit = true;

		}

	}

 ,Event:Event
 ,Aggre:Aggre
 ,commands:commands
 ,commandBus:commandBus
 ,repos:repos

}