#get-super

`npm install --save get-super`

##Usage

```js
var $super = require('get-super');
```
###$super(instance)
Returns the super constructor, bound to `instance`

```js
// ChildClass extends BaseClass
childInstance = new ChildClass()

$super(childInstance)() // BaseClass.call(childInstance)
```

###$super(instance, methodName)
Returns the super `methodName`, bound to `instance`

```js
// ChildClass extends BaseClass
childInstance = new ChildClass()

$super(childInstance, 'toString')() // BaseClass.prototype.toString.call(childInstance)
```

###$super.injectInto(klass)
Injects the method $super into `klass.prototype`:
```js
function ChildClass(arg) {
	this.$super()(arg); // BaseClass.call(this, arg);
}
ChildClass.prototype = Object.create(BaseClass.prototype);
ChildClass.prototype.constructor = ChildClass;

$super.injectInto(ChildClass) // must be called after setting the prototype of ChildClass

ChildClass.prototype.toString = function() {
	return 'child: ' + this.$super('toString')();
}
```

Of course, all objects can have access to `$super` by doing `$super.injectInto(Object)`

##Notes
* If the method is not found, the method does nothing (and thus returns `undefined`)
* For instances of `Object`, a `TypeError` will be thrown when calling `$super`. 
* `constructor` must be set on the Child `prototype` in order for `$super` to work:
```js
ChildClass.prototype.constructor = ChildClass
```
* Objects created with Object.create will not have access to their `prototype`'s super method:
```js
var improperSubInstance = Object.create(baseInstance);
console.log($super(improperSubInstance, 'toString')()); // undefined
```

##Example
```js
var $super = require('get-super');

function Person(name) {
	this.name = name;
}

Person.prototype.getName = function () {
	return this.name;
}

function Child(name, parent) {
	$super(this)(name); // Person.call(this, name);
	this.parent = parent;
}

Child.prototype = Object.create(Person.prototype);
Child.prototype.constructor = Child; // setting the constructor is required
Child.prototype.getName = function() {
	return $super(this, 'getName')() + ', child of ' + this.parent.getName();
}

var father = new Person('Jim');
console.log(father.getName());

child = new Child('Timmy', father);	// Jim
console.log(child.getName()); // Timmy, child of Jim
console.log($super(child, 'getName')()); // Timmy

var bastard = Object.create(father);
bastard.name = 'Tony';
bastard.parent = father;
console.log($super(bastard, 'getName')()); // undefined

var bareObject = {};
// the next line throws TypeError
// console.log($super(bareObject, 'toString')()); 
```
