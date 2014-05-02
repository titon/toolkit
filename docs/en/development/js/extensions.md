# Extensions #

Why stop at components? Why not extend jQuery and MooTools directly with new functionality?
Well don't worry, that's exactly what Toolkit has done.
We extended the prototype of each vendor with new functionality that eased component development.
These extensions may even solve a problem in your own codebase.

## Methods ##

These methods can be found on a jQuery collection.

### toolkit(`string:component`[, `string:method`[, `array:args`]]) ###

Return a component instance if one has been initialized on this element.
If a method is defined, trigger the method on the instance and pass the arguments.
[Learn more about accessing components.](usage.md#accessing-instances)

```javascript
var typeAhead = $('#input').toolkit('typeAhead');
```

### reveal() ###

Show an element by replacing <code>.hide</code> with <code>.show</code>.
By swapping classes, this should trigger any animations or transitions.

```javascript
$('#element').reveal();
```

### conceal() ###

Hide an element by replacing <code>.show</code> with <code>.hide</code>.
By swapping classes, this should trigger any animations or transitions.

```javascript
$('#element').conceal();
```

### positionTo(`string:position`, `element|event:relativeTo`[, `object:baseOffset`[, `bool:isMouse`]]) ###

Position the element relative to another element.
The `position` argument may be any combination of top, bottom, left, right, and center, in dashed format.
The `relativeTo` argument may either be an element or event (used with `isMouse` for mouse following).
The `baseOffset` argument may be an object with default `left` and `top` values.
When set to true, `isMouse` will re-position the element based on mouse cursor dimensions.
If the element falls outside of the viewport, it will be re-positioned by altering the position class name.

```javascript
$('#element').positionTo('top-left', $('#relative-to'));

// Follow the mouse
$('#element').positionTo('bottom-right', event, { left: 10, top: 10 }, true);
```

### addData(`string:key`, `mixed:value`) ###

Set and return data if the key does not exist, else return the current value.
This is a combination of getting and setting internal jQuery data.

```javascript
var value = $('#element').addData('foo', 'bar'); // bar
var value = $('#element').addData('foo', '123'); // bar
```

### aria(`string:key`, `mixed:value`) ###

Sets ARIA attributes on the target element. Works in a similar fashion to `attr()`.
Can also accept an object of key value pairs. Can be disabled by toggling `Toolkit.aria`.

```javascript
// aria-live="off"
$('#element').aria('live', 'off');

// aria-expanded="false" aria-selected="true"
$('#element').aria({
    expanded: false,
    selected: true
});
```

## Selectors ##

These selectors can be used for DOM querying.

### :shown ###

Determines whether an element is visible or not by checking that `visibility` is not equal to hidden.
Is used in conjunction with `conceal()` and `reveal()` for animating.

```javascript
$('#element').is(':shown');
```

## Functions ##

These functions can be found on the jQuery object.

### debounce(`func:func`[, `int:threshold`[, `bool:immediate`]]) ###

Delays the execution of a function until the duration has completed.
If `immediate` is true, then the callback will be triggered immediately.

```javascript
$.debounce(function() {}, 150);
```

### throttle(`func:func`[, `int:delay`[, `array:args`]]) ###

Throttle the execution of a function so it triggers at every delay interval.
Can optionally define an array of arguments that will be passed to the callback.

```javascript
$.throttle(function() {}, 150);

// Pass arguments
$.throttle(function() {}, 150, ['foo', 'bar']);
```

### bound(`int:value`, `int:max`[, `int:min`]) ###

Bound a number between a min and max range, using a 0 based indexing.
If the number is too high, return 0, else if it's too low, return the max number - 1.

```javascript
$.bound(12, 10); // 0

// On an array
var data = [1, 2, 3, 4, 5];

$.bound(-1, data.length); // 4
```

### cookie(`string:key`, `mixed:value`[, `object:options`]) ###

Set a cookie with optional configuration settings. The following settings are available:
`expires` (a number in hours), `path`, `domain`, and `secure`.

```javascript
$.cookie('foo', 'bar', {
    expires: 24, // expires in 24 hours
    secure: true
});
```

### removeCookie(`string:key`[, `object:options`]) ###

Remove a cookie defined by key. Will require the same settings that were used for creation.

```javascript
$.removeCookie('foo');
```

## Events ##

These custom events can be used for common functionality.

### clickout ###

A custom event that triggers when a click occurs outside the element that has been bound.
Is used by drop downs, dialogs, modals, etc.

```javascript
$('#element').on('clickout', function() {
    $(this).hide();
});

// Delegation also works
$(document).on('clickout', '.elements', function() {});
```

### swipe, swipeleft, swiperight, swipeup, swipedown ###

Custom events that emulate swiping on touch devices.
If the device is non-touch, standard mouse events are used instead.

```javascript
$('#element').on('swipeleft', function() {
    // Do something when swiped left
});
```

A few options can be customized on the `$.event.special.swipe` object to alter swipe functionality, they are.

* `duration` (1000) - Maximum time in milliseconds to travel
* `distance` (50) - Minimum distance required to travel
* `restraint` (75) - Maximum distance to travel in the opposite direction
* `suppression` (30) - Maximum distance before suppressing scrolling