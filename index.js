"use strict";

module.exports = function $super(obj, fnName) {
	var proto = Object.getPrototypeOf(obj.constructor.prototype);
	if (!proto) {
		throw new TypeError([obj, 'is not instance of a subclass'].join(' '));
	}
	fnName = fnName || 'constructor';
	var fn = proto[fnName] || function () {};
	return fn.bind(obj);
};
