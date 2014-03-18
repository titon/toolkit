# Drop #

A contextual menu that is dropped down (or up, left, right) and displayed relative a target element.

## Usage ##

Drop menus can be placed anywhere using a `div` with a nested list, or using the list itself as the wrapper.
For the drop to function correctly, the parent will require relative positioning.

```html
<div class="drop--down" role="menu">
    <ul>
        ...
    </ul>
</div>

<ul class="drop--down" role="menu">
    ...
</ul>
```

The drop component must be initialized on an element that targets a menu to display, either through
an attribute, or using a callback function. Refer to the `getTarget` option below.

```html
<div class="button-group">
    <button class="button js-drop" type="button" data-drop="#menu"><span class="caret-down"></span></button>

    <ul class="drop--down" id="menu" role="menu">
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
<ul class="drop--down" role="menu">
<ul class="drop--up" role="menu">
<ul class="drop--left" role="menu">
<ul class="drop--right" role="menu">
```

### Nesting ###

Drops can be nested by inserting a drop menu within an `li` and applying a `.has-children` class.
An optional `.caret-right` can be placed within an anchor link to designate children.

```html
<ul class="drop--left" role="menu">
    <li>...</li>
    <li class="has-children">
        <a href="#"><span class="caret-right"></span> Action</a>

        <ul class="drop--down" role="menu">
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
<ul class="drop--up" role="menu">
    <li>...</li>
    <li class="drop-divider"></li>
    <li>...</li>
</ul>
```

And a header can be used for naming groups.

```html
<ul class="drop--right" role="menu">
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
<ul class="drop--down reverse-align" role="menu">
    ...
</ul>
```

## Notes ##

* The element that targeted and opened the drop menu will have an `.is-active` class.

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
    </tbody>
</table>

## Options ##

Inherits all options from the [parent component](../development/js.md#options).

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

Inherits all events from the [parent component](../development/js.md#events).

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

Inherits all properties from the [parent component](../development/js.md#properties).

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

Inherits all methods from the [parent component](../development/js.md#methods).