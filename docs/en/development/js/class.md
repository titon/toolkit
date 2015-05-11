# Class System #

The majority of Toolkit's JavaScript layer is powered by a custom built [object-oriented](http://en.wikipedia.org/wiki/Object-oriented_programming)[class system](http://en.wikipedia.org/wiki/Class_%28computer_programming%29). This class system provides instanceable objects, each with their own state and behavior. It also provides inheritance of methods and properties through an easy extension mechanism.

## Creating A Class ##

To create a class, simply extend the `Toolkit.Class` interface while passing an object of properties and functions to implement into the prototype. This class can now be instantiated with its own unique state.

```javascript
var Animal = Toolkit.Class.extend({
    gender: 'male',
    talk: function() {
        return 'grr';
    }
});

var beast = new Animal();
    beast.talk(); // grr
```

### Extending Classes ###

Calling `extend()` on any class allows for a sub-class to be created. This sub-class will inherit all properties and methods from its parent, while also implementing its own. It's also possible to overwrite properties and methods found in the parent.

```javascript
var Bird = Animal.extend({
    flying: false,
    talk: function() {
        return 'tweet';
    },
    fly: function() {
        this.flying = true;
    }
});

var Mammal = Animal.extend({
    running: false,
    talk: function() {
        return 'roar';
    },
    run: function() {
        this.running = true;
    }
});

var wings = new Bird();
    wings.talk(); // tweet
    wings.fly(); // flying = true

var legs = new Mammal();
    legs.talk(); // roar
    legs.run(); // running = true
```

## Custom Constructors & Destructors ##

An optional `constructor` function can be defined to bootstrap the class on instantiation. The arguments passed to the object during instantiation will also be passed to the constructor.

Using our first example, let's set a name from the constructor.

```javascript
var Animal = Toolkit.Class.extend({
    name: '',
    constructor: function(name) {
        this.name = name;
    }
});

var beast = new Animal('Fenrir');
    beast.name; // Fenrir
```

Likewise, an optional `destructor` function can be defined that will be called anytime the class is `destroy()`ed. This functionality is only available when extending the [base class](base.md).

```javascript
var Animal = Toolkit.Class.extend({
    destructor: function() {
        // Cleanup
    }
});
```

### Prototype Override ###

It's also possible to alter a previously set constructor by modifying the class's prototype.

```javascript
Animal.prototype.constructor = function(name) {
    this.name = name;
};
```

## Super Methods ##

The class system has no concept of super or parent methods that are found in other languages. Instead, you can simple call the prototype of the method that you overwrote.

```javascript
var Elephant = Mammal.extend({
    run: function() {
        this.talk();
        Mammal.prototype.run.apply(this, arguments);
    }
});
```

Now anytime an elephant starts running, he will roar before hand.

## Static Options ##

A second argument can be passed to `extend()` that will set global static options on the class. These options are used extensively by Toolkit by allowing a customizable default set of options per class.

```javascript
var Helper = Toolkit.Class.extend({}, {
    encode: true
});

Helper.options.encode; // true
Helper.options.encode = false;
```

<div class="notice is-info">
    Options will inherit and merge with any options found on a parent class.
</div>
