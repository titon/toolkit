# Popover #

Contextual popup to display relative to a target element.

## Usage ##

The popover component must be initialized on an element that will trigger the display of the popovers, for example.

```html
<a href="/" class="js-popover" data-popover="This string of text will be displayed in the popover.">Help</a>
```

```javascript
$('.js-popover').popover();
```

<div class="notice is-info">
    The popover component requires the tooltip component, and will inherit all functionality from it.
</div>

<div class="notice is-warning">
    <h5>Delegation requirement</h5>

    If you're using the MooTools library, then the <code>delegate</code> option must be defined,
    and must match the selector that initialized the tooltip.
</div>

### Titles & Content ###

The titles and content within the popover can be customized through the `getTitle` and `getContent`
options respectively. The values to use will either be extracted from the defined HTML
attribute, or through a callback function. If an ID of an element is passed, ala `#element`, then
the contents of that element will be inserted into the popover. If `ajax` is enabled,
then the value will be used as a URL to request, and the response will be inserted as the content.

```html
<button type="button" class="js-popover" title="Popover Title" data-popover="/help/text">AJAX</button>
<button type="button" class="js-popover" title="Popover Title" data-popover="#element">DOM</button>
```

## Notes ##

* A `className` can be added to popovers during instantiation for different themed popovers.
* The `position` of the popover instance determines the location and arrow placement.
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
            <td>.js-popover</td>
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
            <td>Where to position the popover relative to the target element. Available options are: topLeft, topCenter, topRight, centerLeft, centerRight, bottomLeft, bottomCenter, bottomRight.</td>
        </tr>
        <tr>
            <td>className</td>
            <td>string</td>
            <td></td>
            <td>Class name to append to the popover instance. Allows for custom styles.</td>
        </tr>
        <tr>
            <td>animation</td>
            <td>string</td>
            <td></td>
            <td>The animation to use when displaying the popover. Available options are: fade, from-above, from-below, flip-rotate, slide-in.</td>
        </tr>
        <tr>
            <td>ajax</td>
            <td>bool</td>
            <td>false</td>
            <td>Determines whether to load the popover content via an AJAX request.</td>
        </tr>
        <tr>
            <td>loadingMessage</td>
            <td>string</td>
            <td>Toolkit.messages.loading</td>
            <td>
                The message to display in the popover while the AJAX is requesting.
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
            <td>Show the popover title alongside the content if available.</td>
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
            <td>data-popover</td>
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
            <td>The offset in pixels to move the popover along the X axis.</td>
        </tr>
        <tr>
            <td>yOffset</td>
            <td>int</td>
            <td>0</td>
            <td>The offset in pixels to move the popover along the Y axis.</td>
        </tr>
        <tr>
            <td>delay</td>
            <td>int</td>
            <td>0</td>
            <td>The delay in milliseconds before the popover is displayed.</td>
        </tr>
        <tr>
            <td>titleElement</td>
            <td>string</td>
            <td>.popover-head</td>
            <td>CSS selector for the title element within the popover template.</td>
        </tr>
        <tr>
            <td>contentElement</td>
            <td>string</td>
            <td>.popover-body</td>
            <td>CSS selector for the content element within the popover template.</td>
        </tr>
        <tr>
            <td>template</td>
            <td>string</td>
            <td>(below)</td>
            <td>The HTML used to create the popover elements.</td>
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

The following markup is used for the creation of popovers.
This structure can be customized through the `template` option.

```html
<div class="popover">
    <div class="popover-inner">
        <div class="popover-head"></div>
        <div class="popover-body"></div>
    </div>
    <div class="popover-arrow"></div>
</div>
```

## Events ##

Inherits all events from the [parent component](../development/js.md#events) and the [tooltip component](tooltip.md#events).

## Properties ##

Inherits all properties from the [parent component](../development/js.md#properties) and the [tooltip component](tooltip.md#properties).

## Methods ##

Inherits all methods from the [parent component](../development/js.md#methods) and the [tooltip component](tooltip.md#methods).

