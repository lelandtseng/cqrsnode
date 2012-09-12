function asunshift(as,o){
	Array.prototype.unshift.call(as,o);
	return as;
}

module.exorts = asunshift;