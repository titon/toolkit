# Extensions #

Why stop at components? Why not extend jQuery directly with new functionality? Well don't worry, that's exactly what Toolkit has done. We extended the prototype with new functionality that eased component development. These extensions may even solve a problem in your own codebase.

## Methods ##

These methods can be found on a jQuery collection.

### toolkit(`string:component`[, `string:method`[, `array:args`]]) ###

Return a component instance if one has been initialized on this element. If a method is defined, trigger the method on the instance and pass the arguments. [Learn more about accessing components.](usage.md#accessing-instances)

```javascript
var typeAhead = $('#input').toolkit('typeAhead');
```

### reveal([`bool:dontShow`]) ###

Show an element by replacing `.hide` with `.show`. By swapping classes, this should trigger any animations or transitions. Before transitions occur, the element will be displayed.

```javascript
$('#element').reveal(); // shown and visible
```

If a boolean is passed as the 1st argument, the element's display property will not be modified.

```javascript
$('#element').reveal(true); // not shown but visible
```

### conceal([`bool:dontHide`]) ###

Hide an element by replacing `.show` with `.hide`. By swapping classes, this should trigger any animations or transitions. Once the transition is complete, the element will be set to display none.

```javascript
$('#element').conceal(); // hidden and invisible
```

If a boolean is passed as the 1st argument, the element's display property will not be modified.

```javascript
$('#element').conceal(true); // not hidden but invisible
```

<div class="notice is-info">
    The display will only be set to none if the element had <code>.show</code> applied once <code>conceal()</code> was called.
</div>

### positionTo(`string:position`, `element|event:relativeTo`[, `object:baseOffset`[, `bool:isMouse`]]) ###

Position the element relative to another element. The `position` argument may be any combination of top, bottom, left, right, and center, in dashed format. The `relativeTo` argument may either be an element or event (used with `isMouse` for mouse following). The `baseOffset` argument may be an object with default `left` and `top` values. When set to true, `isMouse` will re-position the element based on mouse cursor dimensions. If the element falls outside of the viewport, it will be re-positioned by altering the position class name.

```javascript
$('#element').positionTo('top-left', $('#relative-to'));

// Follow the mouse
$('#element').positionTo('bottom-right', event, { left: 10, top: 10 }, true);
```

### cache(`string:key`[, `mixed:value`]) ###

Set and return data if the key does not exist, else return the current value. This is a combination of getting and setting internal jQuery data.

```javascript
var value = $('#element').cache('foo', 'bar'); // bar
var value = $('#element').cache('foo', '123'); // bar
```

### aria(`string:key`[, `mixed:value`]) ###

Sets ARIA attributes on the target element. Works in a similar fashion to `attr()`. Can also accept an object of key value pairs. Can be disabled by toggling `Toolkit.aria`.

```javascript
// aria-live="off"
$('#element').aria('live', 'off');

// aria-expanded="false" aria-selected="true"
$('#element').aria({
    expanded: false,
    selected: true
});
```

You can also use the method to return a value for an ARIA attribute.

```javascript
$('#element').aria('live'); // off
```

### transitionend(`func:func`) ###

Sets a callback function as a `transitionend` event that will only be triggered once. If the element does not have a CSS transition property defined, the callback will be executed immediately. This is handy for chaining methods and supporting browsers that don't have transitions.

```javascript
$('#element').transitionend(function() {
    // Do something
}).reveal();
```

### toString() ###

Returns the elements markup as a string. If the collection contains multiple elements, only the 1st element will be used.

```javascript
$('#element').toString(); // Markup as a string
```

## Selectors ##

These selectors can be used for DOM querying.

### :shown ###

Determines whether an element is visible or not by checking that `visibility` is not equal to hidden. Is used in conjunction with `conceal()` and `reveal()` for animating.

```javascript
$('#element').is(':shown');
```

## Functions ##

These functions can be found on the jQuery object.

### debounce(`func:func`[, `int:threshold`]) ###

Delays the execution of a function until the duration has completed. If `immediate` is true, then the callback will be triggered immediately.

```javascript
$.debounce(function() {}, 150);
```

### throttle(`func:func`[, `int:delay`[, `array:args`]]) ###

Throttle the execution of a function so it triggers at every delay interval. Can optionally define an array of arguments that will be passed to the callback.

```javascript
$.throttle(function() {}, 150);

// Pass arguments
$.throttle(function() {}, 150, ['foo', 'bar']);
```

### bound(`int:value`, `int:max`[, `int:min`]) ###

Bound a number between a min and max range, using a 0 based indexing. If the number is too high, return 0, else if it's too low, return the max number - 1.

```javascript
$.bound(12, 10); // 0

// On an array
var data = [1, 2, 3, 4, 5];

$.bound(-1, data.length); // 4
```

## Events ##

These custom events can be used for common functionality.

### clickout ###

A custom event that triggers when a click occurs outside the element that has been bound. Is used by drop downs, dialogs, modals, etc.

```javascript
$('#element').on('clickout', function() {
    $(this).hide();
});

// Delegation also works
$(document).on('clickout', '.elements', function() {});
```

### swipe ###

Custom events that emulate swiping on touch devices. The available events are `swipeleft`, `swiperight`, `swipeup`, and `swipedown`. If the device is non-touch, standard mouse events are used instead.

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

### horizontalresize ###

A custom event that triggers when a horizontal browser resize occurs.

```javascript
$(window).on('horizontalresize', function() {
    // Browser was resized horizontally
});
```

### verticalresize ###

A custom event that triggers when a vertical browser resize occurs.

```javascript
$(window).on('verticalresize', function() {
    // Browser was resized vertically
});
```
