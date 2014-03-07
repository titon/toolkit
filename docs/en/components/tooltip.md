# Tooltip #

A contextual box displayed relative to a target element while hovering.

## Usage ##

The tooltip component must be initialized on an element that will trigger the display of the tooltips, for example.

```html
<a href="/" class="js-tooltip" data-tooltip="This string of text will be displayed in the tooltip.">Help</a>
```

```javascript
$('.js-tooltip').tooltip();
```

The tooltip will display either through a click, or a hover, depending on the configuration.

<div class="notice is-warning">
    <h5>Delegation requirement</h5>

    If you're using the MooTools library, then the <code>delegate</code> option must be defined,
    and must match the selector that initialized the tooltip.
</div>

### Titles & Content ###

The titles and content within the tooltip can be customized through the `getTitle` and `getContent`
options respectively. The values to use will either be extracted from the defined HTML
attribute, or through a callback function. If an ID of an element is passed, ala `#element`, then
the contents of that element will be inserted into the tooltip. If `ajax` is enabled,
then the value will be used as a URL to request, and the response will be inserted as the content.

```html
<button type="button" class="js-tooltip" title="Tooltip Title" data-tooltip="/help/text">AJAX</button>
<button type="button" class="js-tooltip" title="Tooltip Title" data-tooltip="#element">DOM</button>
```

### Mouse Following ###

To force the tooltip to follow the location of the mouse, set `follow` to true.

```javascript
$('.js-tooltip').tooltip({
    follow: true
});
```

## Notes ##

* A `className` can be added to tooltips during instantiation for different themed tooltips.
* The `position` of the tooltip instance determines the location and arrow placement.
* The `position` and `animation` will be appended as a class names.

## Options ##

Inherits all options from the [parent component](../development/js.md#options).

<table class="table data-table">
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
            <td>delegate</td>
            <td>string</td>
            <td>.js-tooltip</td>
            <td>CSS selector to apply event delegation to. (MooTools only)</td>
        </tr>
        <tr>
            <td>context</td>
            <td>object</td>
            <td>body</td>
            <td>The element to attach delegated events to.</td>
        </tr>
        <tr>
            <td>position</td>
            <td>string</td>
            <td>topCenter</td>
            <td>Where to position the tooltip relative to the target element. Available options are: topLeft, topCenter, topRight, centerLeft, centerRight, bottomLeft, bottomCenter, bottomRight.</td>
        </tr>
        <tr>
            <td>className</td>
            <td>string</td>
            <td></td>
            <td>Class name to append to the tooltip instance. Allows for custom styles.</td>
        </tr>
        <tr>
            <td>animation</td>
            <td>string</td>
            <td></td>
            <td>The animation to use when displaying the tooltip. Available options are: fade, from-above, from-below, flip-rotate, slide-in.</td>
        </tr>
        <tr>
            <td>mode</td>
            <td>string</td>
            <td>hover</td>
            <td>The type of interaction required to activate the tooltip. Accepts click or hover.</td>
        </tr>
        <tr>
            <td>ajax</td>
            <td>bool</td>
            <td>false</td>
            <td>Determines whether to load the tooltip content via an AJAX request.</td>
        </tr>
        <tr>
            <td>follow</td>
            <td>bool</td>
            <td>false</td>
            <td>Will position the tooltip relative to the mouse cursor instead of the target element.</td>
        </tr>
        <tr>
            <td>mouseThrottle</td>
            <td>int</td>
            <td>50</td>
            <td>The time in milliseconds to throttle the mouse follow events.</td>
        </tr>
        <tr>
            <td>loadingMessage</td>
            <td>string</td>
            <td>Toolkit.messages.loading</td>
            <td>
                The message to display in the tooltip while the AJAX is requesting.
                Only displays if <code>showLoading</code> is true.
            </td>
        </tr>
        <tr>
            <td>showLoading</td>
            <td>bool</td>
            <td>true</td>
            <td>Show the loading message while waiting for an AJAX request to complete.</td>
        </tr>
        <tr>
            <td>showTitle</td>
            <td>bool</td>
            <td>true</td>
            <td>Show the tooltip title alongside the content if available.</td>
        </tr>
        <tr>
            <td>getTitle</td>
            <td>string|function</td>
            <td>title</td>
            <td>
                If a string is passed, fetch the content from the HTML attribute.
                If a function is passed, use the return value as the content.
            </td>
        </tr>
        <tr>
            <td>getContent</td>
            <td>string|function</td>
            <td>data-tooltip</td>
            <td>
                If a string is passed, fetch the content from the HTML attribute.
                If a string is passed in #id format, fetch the content from the HTML of the element.
                If a function is passed, use the return value as the content.
            </td>
        </tr>
        <tr>
            <td>xOffset</td>
            <td>int</td>
            <td>0</td>
            <td>The offset in pixels to move the tooltip along the X axis.</td>
        </tr>
        <tr>
            <td>yOffset</td>
            <td>int</td>
            <td>0</td>
            <td>The offset in pixels to move the tooltip along the Y axis.</td>
        </tr>
        <tr>
            <td>delay</td>
            <td>int</td>
            <td>0</td>
            <td>The delay in milliseconds before the tooltip is displayed.</td>
        </tr>
        <tr>
            <td>titleElement</td>
            <td>string</td>
            <td>.tooltip-head</td>
            <td>CSS selector for the title element within the tooltip template.</td>
        </tr>
        <tr>
            <td>contentElement</td>
            <td>string</td>
            <td>.tooltip-body</td>
            <td>CSS selector for the content element within the tooltip template.</td>
        </tr>
        <tr>
            <td>template</td>
            <td>string</td>
            <td>(below)</td>
            <td>The HTML used to create the tooltip elements.</td>
        </tr>
        <tr>
            <td>templateFrom</td>
            <td>string</td>
            <td></td>
            <td>The ID of an element to use as the template.</td>
        </tr>
    </tbody>
</table>

## Template ##

The following markup is used for the creation of tooltips.
This structure can be customized through the `template` option.

```html
<div class="tooltip">
    <div class="tooltip-inner">
        <div class="tooltip-head"></div>
        <div class="tooltip-body"></div>
    </div>
    <div class="tooltip-arrow"></div>
</div>
```

## Events ##

Inherits all events from the [parent component](../development/js.md#events).

## Properties ##

Inherits all properties from the [parent component](../development/js.md#properties).

<table class="table data-table">
    <thead>
        <tr>
            <th>Property</th>
            <th>Type</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>elementHead</td>
            <td>element</td>
            <td>The element used for titles. Is found within the <code>element</code> element.</td>
        </tr>
        <tr>
            <td>elementBody</td>
            <td>element</td>
            <td>The element used for content. Is found within the <code>element</code> element.</td>
        </tr>
        <tr>
            <td>cache</td>
            <td>object</td>
            <td>Collection of cached AJAX requests indexed by URL.</td>
        </tr>
    </tbody>
</table>

## Methods ##

Inherits all methods from the [parent component](../development/js.md#methods).

<table class="table data-table">
    <thead>
        <tr>
            <th>Method</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>position([string:content[, string:title]])</td>
            <td>
                Position the content relative to the node and set optional content and title.
                This method is called automatically by <code>show()</code>.
            </td>
        </tr>
        <tr>
            <td>show([element:node[, string:content[, string:title]]])</td>
            <td>
                Display the tooltip relative to the node. If no node is passed, will use the last node.
                If no content or title is passed, the values will be fetched from the node using the <code>getContent</code> and <code>getTitle</code> options.
            </td>
        </tr>
    </tbody>
</table>