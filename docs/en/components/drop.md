# Drop #

A contextual menu that is dropped down (or up, left, right) and displayed relative a target element.

## Usage ##

Drop menus can be placed anywhere using a `div` with a nested list, or using the list itself as the wrapper.
Each drop will require a `.drop` class and one of the directional modifiers listed below.
For the drop to function correctly, the parent will require relative positioning.

```html
<div class="drop drop--down">
    <ul>
        ...
    </ul>
</div>

<ul class="drop drop--up">
    ...
</ul>
```

The drop component must be initialized on an element that targets a menu to display, either through
an attribute, or using a callback function. Refer to the `getTarget` option below.

```html
<div class="button-group">
    <button class="button js-drop" type="button" data-drop="#menu"><span class="caret-down"></span></button>

    <ul class="drop drop--down" id="menu">
        ...
    </ul>
</div>
```

```javascript
$('.js-drop').drop();
```

The drop menu will display either through a click, or a hover, depending on the configuration.

### Positioning ###

Dropdowns, dropups, droplefts, and droprights are all supported through their respective modifier class.

```html
<ul class="drop drop--down">...</ul>
<ul class="drop drop--up">...</ul>
<ul class="drop drop--left">...</ul>
<ul class="drop drop--right">...</ul>
```

### Nesting ###

Drops can be nested by inserting a drop menu within an `li` and applying a `.has-children` class.
An optional `.caret-right` can be placed within an anchor link to designate children.

```html
<ul class="drop drop--left">
    <li>...</li>
    <li class="has-children">
        <a href="#"><span class="caret-right"></span> Action</a>

        <ul class="drop drop--down">
            ...
        </ul>
    </li>
</ul>
```

<div class="notice is-info">
    Only <code>.drop--down</code> and <code>.drop--up</code> menus can be nested.
</div>

### Headers & Dividers ###

A divider can be used to split actions into groups.

```html
<ul class="drop drop--up">
    <li>...</li>
    <li class="drop-divider"></li>
    <li>...</li>
</ul>
```

And a header can be used for naming groups.

```html
<ul class="drop drop--right">
    <li class="drop-heading">Group</li>
    <li>...</li>
    <li class="drop-heading">Group</li>
    <li>...</li>
</ul>
```

### Alignment ###

To align the drop menu against the opposite edge, add a `.reverse-align` class.
Reverse alignment works for both horizontal and vertical menus.

```html
<ul class="drop drop--down reverse-align">
    ...
</ul>
```

### Notes ###

* The element that targeted and opened the drop menu will have an `.is-active` class.

## ARIA ##

The `menu`, and `menuitem` roles, and the appropriate `aria-*`
attributes are required when supporting ARIA.

```html
<ul class="drop drop--down" role="menu" id="menu">
    <li><a href="" role="menuitem">Item</a></li>
    ...
    <li class="drop-divider" role="separator"></li>
    ...
    <li class="has-children" aria-haspopup="true">
        <a href="" role="menuitem">Item</a>

        <ul class="drop drop--down" role="menu">...</ul>
    </li>
</ul>
```

The element that opens the drop menu will need the `aria-haspopup` and `aria-controls`
(relates to drop target ID) attributes.

```html
<button class="button js-drop" type="button" data-drop="#menu" aria-controls="menu" aria-haspopup="true">
    ...
</button>
```

<div class="notice is-warning">
    Manual definition of these ARIA attributes will be required.
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
            <td>$drop-transition</td>
            <td>.3s</td>
            <td>The transition time for menu fade and nested menu slide animations.</td>
        </tr>
        <tr>
            <td>$drop-zindex</td>
            <td>500</td>
            <td>The z-index for the drop element.</td>
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
            <td>mode</td>
            <td>string</td>
            <td>click</td>
            <td>
                The type of interaction for toggling a drop.
                Accepts click or hover.
            </td>
        </tr>
        <tr>
            <td>getTarget</td>
            <td>string|function</td>
            <td>data-drop</td>
            <td>
                If a string is passed, fetch the ID from the HTML attribute.
                If a function is passed, use the return value as the ID.
                The ID should point to a drop element.
            </td>
        </tr>
        <tr>
            <td>hideOpened</td>
            <td>bool</td>
            <td>true</td>
            <td>Hides the previously opened drop menu.</td>
        </tr>
    </tbody>
</table>

## Events ##

Inherits all events from the [parent component](../development/js/component.md#events).

<table class="table is-striped data-table">
    <thead>
        <tr>
            <th>Option Event</th>
            <th>Element Event</td>
            <th>Arguments</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>onHide</td>
            <td>hide.toolkit.drop</td>
            <td>element:menu, element:node</td>
            <td>Triggered when a drop menu is hidden.</td>
        </tr>
        <tr>
            <td>onShow</td>
            <td>show.toolkit.drop</td>
            <td>element:menu, element:node</td>
            <td>Triggered when a drop menu is shown.</td>
        </tr>
    </tbody>
</table>

## Properties ##

Inherits all properties from the [parent component](../development/js/component.md#properties).

<table class="table is-striped data-table">
    <thead>
        <tr>
            <th>Property</th>
            <th>Type</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>element</td>
            <td>element</td>
            <td>The drop menu currently being displayed.</td>
        </tr>
    </tbody>
</table>

## Methods ##

Inherits all methods from the [parent component](../development/js/component.md#methods).