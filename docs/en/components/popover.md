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
    The Popover component requires the Tooltip component, and will inherit all functionality from it.
    Jump over to the tooltip documentation for more information on how to use this component.
</div>

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

<div class="notice is-info">
    The <code>.popover-head</code> and <code>.popover-body</code> elements are required for inserting content into.
</div>

## Variables ##

<table class="table is-striped data-table">
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
        <tr>
            <td>$popover-zindex</td>
            <td>700</td>
            <td>The z-index for the popover element.</td>
        </tr>
    </tbody>
</table>

## Options ##

Inherits all options from the [parent component](../development/js/component.md#options).

<table class="table is-striped data-table">
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
    </tbody>
</table>

## Events ##

Inherits all events from the [parent component](../development/js/component.md#events) and the [Tooltip component](tooltip.md#events).

## Properties ##

Inherits all properties from the [parent component](../development/js/component.md#properties) and the [Tooltip component](tooltip.md#properties).

## Methods ##

Inherits all methods from the [parent component](../development/js/component.md#methods) and the [Tooltip component](tooltip.md#methods).

