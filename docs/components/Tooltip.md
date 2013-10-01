# Tooltip #

Displays an informative tooltip relative to a target element. The tooltip can be activated through a hover or click event.

## Usage ##

The tooltip component must be initialized through the `Titon.Tooltip` JavaScript class.
A target must be defined when initializing the class.

```javascript
// jQuery
$('.js-tooltip').tooltip();

// MooTools
$$('.js-tooltip').tooltip();
```

Any element that has the `js-tooltip` class will now activate and display the tooltip.
The tooltip will disappear when the element is no longer the target.

```html
<a href="/" class="js-tooltip" data-tooltip="This string of text will be displayed in the tooltip.">Help</a>
```

The tooltip instance can be accessed through the `toolkit()` method.
This instance provides additional properties and methods to manipulate.

```javascript
// jQuery
var tooltip = $('.js-tooltip').toolkit('tooltip');

// MooTools
var tooltip = $$('.js-tooltip').toolkit('tooltip');
```

#### Delegation in MooTools ####

If another target besides `.js-tooltip` is used, the `delegate` option must be defined.
This provides event delegation support for instances where MooTools does not support it.

```javascript
$$('.tip').tooltip({ delegate: '.tip' });
```

## Options ##

Options can be customized by passing an object of key value pairs to the `tooltip()` method.

```javascript
// jQuery
$('.js-tooltip').tooltip({
    animation: 'fade'
});

// MooTools
$$('.js-tooltip').tooltip({
    position: 'bottomLeft'
});
```

<table>
    <thead>
        <tr>
            <th>Option</th>
            <th>Type</th>
            <th>Default</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>`delegate`</td>
            <td>*string*</td>
            <td>.js-tooltip</td>
            <td>The CSS query to apply event delegation to. (MooTools only)</td>
        </tr>
        <tr>
            <td>`context`</td>
            <td>*object*</td>
            <td>body</td>
            <td>The element to attach delegated events to.</td>
        </tr>
        <tr>
            <td>`position`</td>
            <td>*string*</td>
            <td>topRight</td>
            <td>Where to position the tooltip relative to the target element. Available options are: topLeft, topCenter, topRight, centerLeft, centerRight, bottomLeft, bottomCenter, bottomRight.</td>
        </tr>
        <tr>
            <td>`className`</td>
            <td>*string*</td>
            <td></td>
            <td>Class name to append to the tooltip instance. Allows for custom styles.</td>
        </tr>
        <tr>
            <td>`animation`</td>
            <td>*string*</td>
            <td></td>
            <td>The animation to use when displaying the tooltip. Available options are: fade, from-above, from-below, flip-rotate, slide-in.</td>
        </tr>
        <tr>
            <td>`mode`</td>
            <td>*string*</td>
            <td>hover</td>
            <td>The type of interaction required to activate the tooltip. Available options are: click, hover.</td>
        </tr>
        <tr>
            <td>`ajax`</td>
            <td>*bool*</td>
            <td>false</td>
            <td>Determines whether to load the tooltip content via an AJAX request.</td>
        </tr>
        <tr>
            <td>`follow`</td>
            <td>*bool*</td>
            <td>false</td>
            <td>Will position the tooltip relative to the mouse cursor instead of the target element.</td>
        </tr>
        <tr>
            <td>`mouseThrottle`</td>
            <td>*number*</td>
            <td>50</td>
            <td>The time in milliseconds to throttle the mouse follow events.</td>
        </tr>
        <tr>
            <td>`showLoading`</td>
            <td>*bool*</td>
            <td>true</td>
            <td>Show the loading message while waiting for an AJAX request to complete.</td>
        </tr>
        <tr>
            <td>`showTitle`</td>
            <td>*bool*</td>
            <td>true</td>
            <td>Show the tooltip title alongside the content if available.</td>
        </tr>
        <tr>
            <td>`getTitle`</td>
            <td>*string|function*</td>
            <td>title</td>
            <td>
                If a string is passed, fetch the content from the HTML attribute.
                If a function is passed, use the return value as the content.
            </td>
        </tr>
        <tr>
            <td>`getContent`</td>
            <td>*string|function*</td>
            <td>data-tooltip</td>
            <td>
                If a string is passed, fetch the content from the HTML attribute.
                If a string is passed in #id format, fetch the content from the HTML of the element.
                If a function is passed, use the return value as the content.
            </td>
        </tr>
        <tr>
            <td>`xOffset`</td>
            <td>*number*</td>
            <td>0</td>
            <td>The offset in pixels to move the tooltip along the X axis.</td>
        </tr>
        <tr>
            <td>`yOffset`</td>
            <td>*number*</td>
            <td>0</td>
            <td>The offset in pixels to move the tooltip along the Y axis.</td>
        </tr>
        <tr>
            <td>`delay`</td>
            <td>*number*</td>
            <td>0</td>
            <td>The delay in milliseconds before the tooltip is displayed.</td>
        </tr>
        <tr>
            <td>`template`</td>
            <td>*string*</td>
            <td></td>
            <td>The HTML used to create the tooltip elements. Defaults to:
```html
<div class="tooltip">
    <div class="tooltip-inner">
        <div class="tooltip-head"></div>
        <div class="tooltip-body"></div>
    </div>
    <div class="tooltip-arrow"></div>
</div>
```
            </td>
        </tr>
        <tr>
            <td>`titleElement`</td>
            <td>*string*</td>
            <td>.tooltip-head</td>
            <td>CSS query for the title element within the tooltip template.</td>
        </tr>
        <tr>
            <td>`contentElement`</td>
            <td>*string*</td>
            <td>.tooltip-body</td>
            <td>CSS query for the content element within the tooltip template.</td>
        </tr>
    </tbody>
</table>

## Events ##

Events are defined in the same manner as options. Simply place the functions in the same configuration object.
The `this` context of each event function will reference the component class instance.

```javascript
// jQuery
$('.js-tooltip').tooltip({
    onInit: function() {}
});

// MooTools
$$('.js-tooltip').tooltip({
    onShow: function() {}
});
```

<table>
    <thead>
        <tr>
            <th>Event</th>
            <th>Arguments</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>`onInit`</td>
            <td></td>
            <td>Triggered when the component is initialized. Will only trigger once.</td>
        </tr>
        <tr>
            <td>`onShow`</td>
            <td></td>
            <td>Triggered when the tooltip is shown.</td>
        </tr>
        <tr>
            <td>`onHide`</td>
            <td></td>
            <td>Triggered when the tooltip is hidden.</td>
        </tr>
    </tbody>
</table>

## Properties ##

The following properties are available within the tooltip instance.

<table>
    <thead>
        <tr>
            <th>Property</th>
            <th>Type</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>`options`</td>
            <td>*object*</td>
            <td>An object of key value configuration options.</td>
        </tr>
        <tr>
            <td>`element`</td>
            <td>*element*</td>
            <td>The element created from the `template` option. Is used to render the tooltip markup.</td>
        </tr>
        <tr>
            <td>`elementHead`</td>
            <td>*element*</td>
            <td>The element used for titles. Is found within the `element` element.</td>
        </tr>
        <tr>
            <td>`elementBody`</td>
            <td>*element*</td>
            <td>The element used for content. Is found within the `element` element.</td>
        </tr>
        <tr>
            <td>`nodes`</td>
            <td>*elements*</td>
            <td>List of elements that were targeted during initialization.</td>
        </tr>
        <tr>
            <td>`node`</td>
            <td>*element*</td>
            <td>The current element to activate the tooltip.</td>
        </tr>
    </tbody>
</table>

## Methods ##

The following methods are available within the tooltip instance.

<table>
    <thead>
        <tr>
            <th>Method</th>
            <th>Arguments</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>`enable()`</td>
            <td></td>
            <td>Enable the component.</td>
        </tr>
        <tr>
            <td>`disable()`</td>
            <td></td>
            <td>Disable the component.</td>
        </tr>
        <tr>
            <td>`show(node, content, title)`</td>
            <td>*element* node[, *string* content[, *string* title]]</td>
            <td>
                Display the tooltip relative to the node. If no node is passed, will use the last node.
                If no content or title is passed, the values will be fetched from the node using the `getContent` and `getTitle` options.
            </td>
        </tr>
        <tr>
            <td>`hide()`</td>
            <td></td>
            <td>Hide the tooltip.</td>
        </tr>
    </tbody>
</table>