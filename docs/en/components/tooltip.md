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

### Dynamic Content Loading ###

Tooltips use a form of dynamic content loading. This allows the body of the tooltip to be loaded dynamically from multiple sources, either from an AJAX request, an element, or a literal value.

* [Learn more about dynamic content loading.](../development/js/usage.md#dynamic-content-loading)

### Titles & Content ###

The titles and content within the tooltip can be customized through the `getTitle` and `getContent` options respectively. The values to use will either be extracted from the defined HTML attribute, or through a callback function.

```html
<button type="button" class="js-tooltip" title="Tooltip Title" data-tooltip="/help/text">AJAX</button>
<button type="button" class="js-tooltip" title="Tooltip Title" data-tooltip="#element">DOM</button>
```

These values use the dynamic content loading mentioned above.

#### Manual Updates ####

To programmatically update the tooltip with JavaScript, the `show()` method on the tooltip instance can be used. When calling `show()`, an element can be passed as the 1st argument to position the tooltip relative to. If no element is passed, the last element hovered will be used. The 2nd argument is the custom content.

```javascript
$('#button').toolkit('tooltip', 'show', [null, 'Custom content']);
```

If we want to update the node and then trigger the tooltip, something like the following can be used. This example assumes that `getContent` is set to `data-tooltip`.

```javascript
var node = $('#button');
    node.data('tooltip', 'New content!').toolkit('tooltip', 'show', node);
```

### Mouse Following ###

To force the tooltip to follow the location of the mouse, set `follow` to true.

```javascript
$('.js-tooltip').tooltip({
    follow: true
});
```

### Notes ###

* A `className` can be added to tooltips during instantiation for different themed tooltips.
* The `position` of the tooltip instance determines the location and arrow placement.
* The `position` and `animation` will be appended as a class names.

## ARIA ##

The `tooltip` role and the appropriate `aria-*` attributes are required when supporting ARIA. [Learn more about this role.](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_tooltip_role)

```html
<div class="tooltip" role="tooltip">
    ...
</div>
```

<div class="notice is-info">
    The JavaScript component will automatically map all ARIA attributes.
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
            <td>$tooltip-tooltip-animations</td>
            <td>("fade", "from-above", "from-below", "flip-rotate")</td>
            <td>A list of all animations to include in the CSS output.</td>
        </tr>
        <tr>
            <td>$tooltip-arrow-width</td>
            <td>6</td>
            <td>The border size for tooltip arrows.</td>
        </tr>
        <tr>
            <td>$tooltip-class</td>
            <td>.tooltip</td>
            <td>CSS class name for the tooltip wrapper.</td>
        </tr>
        <tr>
            <td>$tooltip-class-arrow</td>
            <td>.tooltip-arrow</td>
            <td>CSS class name for the tooltip arrow.</td>
        </tr>
        <tr>
            <td>$tooltip-class-head</td>
            <td>.tooltip-head</td>
            <td>CSS class name for the tooltip header element.</td>
        </tr>
        <tr>
            <td>$tooltip-class-body</td>
            <td>.tooltip-body</td>
            <td>CSS class name for the tooltip body element.</td>
        </tr>
        <tr>
            <td>$tooltip-zindex</td>
            <td>700</td>
            <td>The z-index for the tooltip element.</td>
        </tr>
    </tbody>
</table>

## Options ##

Inherits all options from the [parent Component](component.md#options).

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
            <td>animation</td>
            <td>string</td>
            <td></td>
            <td>The animation to use when displaying the tooltip. Available options are: fade, from-above, from-below, flip-rotate.</td>
        </tr>
        <tr>
            <td>follow</td>
            <td>bool</td>
            <td>false</td>
            <td>Will position the tooltip relative to the mouse cursor instead of the target element.</td>
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
            <td>getTitle</td>
            <td>string|function</td>
            <td>title</td>
            <td>
                If a string is passed, fetch the content from the HTML attribute.
                If a function is passed, use the return value as the content.
            </td>
        </tr>
        <tr>
            <td>mode</td>
            <td>string</td>
            <td>hover</td>
            <td>The type of interaction required to activate the tooltip. Accepts click or hover.</td>
        </tr>
        <tr>
            <td>mouseThrottle</td>
            <td>int</td>
            <td>50</td>
            <td>The time in milliseconds to throttle the mouse follow events.</td>
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
            <td>template</td>
            <td>string</td>
            <td>
                &lt;div class="tooltip"&gt;<br>
                    &lt;div class="tooltip-inner"&gt;<br>
                        &lt;div class="tooltip-head" data-tooltip-header&gt;&lt;/div&gt;<br>
                        &lt;div class="tooltip-body" data-tooltip-content&gt;&lt;/div&gt;<br>
                    &lt;/div&gt;<br>
                    &lt;div class="tooltip-arrow"&gt;&lt;/div&gt;<br>
                &lt;/div&gt;
            </td>
            <td>The tooltip markup. The <code>data-tooltip-*</code> attributes are required.</td>
        </tr>
        <tr>
            <td>wrapperClass</td>
            <td>string</td>
            <td>tooltips</td>
            <td>The class name to set on the composite wrapper.</td>
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
    </tbody>
</table>

## Events ##

Inherits all events from the [parent Component](component.md#events).

<table class="table is-striped data-table">
    <thead>
        <tr>
            <th>Event</td>
            <th>Arguments</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>load</td>
            <td>mixed:content, mixed:title</td>
            <td>Triggered after the tooltip content has been set but before it is shown.</td>
        </tr>
    </tbody>
</table>

## Properties ##

Inherits all properties from the [parent Component](component.md#properties).

## Methods ##

Inherits all methods from the [parent Component](component.md#methods).

<table class="table is-striped data-table">
    <thead>
        <tr>
            <th>Method</th>
            <th>Description</th>
            <th>Bound To</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>position(string:content[, string:title])</td>
            <td>
                Position the content relative to the node and set optional content and title.
                This method is called automatically by <code>show()</code>.
            </td>
            <td></td>
        </tr>
        <tr>
            <td>show([element:node[, string:content]])</td>
            <td>
                Display the tooltip relative to the node. If no node is passed, will use the last node.
                If no content is passed, the values will be fetched from the node using the <code>getContent</code> and <code>getTitle</code> options.
            </td>
            <td><code>selector</code></td>
        </tr>
    </tbody>
</table>
