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

## Variables ##

<table class="table data-table">
    <thead>
        <tr>
            <th>Variable</th>
            <th>Default</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>$popover-tooltip-animation</td>
            <td>("fade", "from-above", "from-below", "flip-rotate")</td>
            <td>A list of all animations to include in the CSS output.</td>
        </tr>
        <tr>
            <td>$popover-arrow-width</td>
            <td>8</td>
            <td>The border size for popover arrows.</td>
        </tr>
    </tbody>
</table>

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
            <td>position</td>
            <td>string</td>
            <td>top-center</td>
            <td>
                Where to position the tooltip relative to the target element. Available options are:
                top-left, top-center, top-right, center-left, center-right, bottom-left, bottom-center, bottom-right.
            </td>
        </tr>
        <tr>
            <td>animation</td>
            <td>string</td>
            <td></td>
            <td>The animation to use when displaying the popover. Available options are: fade, from-above, from-below, flip-rotate.</td>
        </tr>
        <tr>
            <td>ajax</td>
            <td>bool</td>
            <td>false</td>
            <td>Determines whether to load the popover content via an AJAX request.</td>
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

