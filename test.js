"use strict";

var should = require('chai').should();

var $super = require('./.');

function BaseClass(val) {
	this.val = val;
}

BaseClass.prototype.value = function() {
	return ['base', this.val].join(':');
};

function SubClass(val) {
	BaseClass.call(this, val);
}

SubClass.prototype = Object.create(BaseClass.prototype);
SubClass.prototype.constructor = SubClass;
SubClass.prototype.value = function() {
	return ['sub', this.val].join(':');
};

var subInstance = new SubClass(1);

suite('super', function() {

	test('throws error when not a subclass instance', function() {
		var a = {};
		var callSuper = function() { $super(a) };
		callSuper.should.throw(Error);
	});

	test('throws error when doing Object.create with an Object proto', function() {
		var extendedBaseInstance = Object.create({});
		var callSuper = function() { $super(extendedBaseInstance) };
		callSuper.should.throw(Error);
	});

	test('calls the super method when available', function() {
		$super(subInstance, 'value')().should.eql('base:1');
	});

	test('does nothing when the super not available', function() {
		should.not.exist($super(subInstance, 'not_found')());
	});

	test('calls the constructor if no method name given', function() {
		var instance = new SubClass();
		$super(instance)(20);
		instance.value().should.eql('sub:20');
		$super(instance, 'value')().should.eql('base:20');
	});

	test('calls the super method even after Object.create based on a sub instance', function() {
		var extendedSubInstance = Object.create(subInstance);
		$super(extendedSubInstance, 'value')().should.eql('base:1');
	});

});

suite('inject', function() {
	function InjectedSubClass(val) {
		this.$super()(val);
	}
	InjectedSubClass.prototype = Object.create(BaseClass.prototype);
	InjectedSubClass.prototype.constructor = InjectedSubClass;
	InjectedSubClass.prototype.value = function() {
		return ['sub', this.$super('value')()].join(':')
	};

	$super.injectInto(InjectedSubClass);

	var injectedInstance = new InjectedSubClass(10);

	test('constructor works', function() {
		injectedInstance.val.should.eql(10);
	});

	test('method works', function() {
		injectedInstance.value().should.eql('sub:base:10');
	});
});
