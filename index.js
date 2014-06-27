"use strict";

var $super = module.exports = function $super(obj, fnName) {
	var proto = Object.getPrototypeOf(obj.constructor.prototype);
	if (!proto) {
		throw new TypeError([obj, 'is not instance of a subclass'].join(' '));
	}
	fnName = fnName || 'constructor';
	var fn = proto[fnName] || function () {};
	return fn.bind(obj);
};

$super.injectInto = function(klass) {
	klass.prototype.$super = function(fnName) {
		return $super(this, fnName);
	};
};
