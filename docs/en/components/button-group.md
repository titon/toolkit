# Button Group #

Groups multiple buttons by collapsing spacing in between to visually mimic a single button.

## Usage ##

Buttons can be grouped using a `div`, `ul`, or `ol`.

```html
<div class="button-group">
    <button class="button" type="button">Left</button>
    <button class="button" type="button">Middle</button>
    <button class="button" type="button">Right</button>
</div>

<ul class="button-group">
    <li><button class="button" type="button">Left</button></li>
    <li><button class="button" type="button">Middle</button></li>
    <li><button class="button" type="button">Right</button></li>
</ul>
```

The most common use case for button groups is creating split buttons.
A split button is a grouping of 2 buttons, one of which is an action, and the other opens a menu.
More information on drop menus can be found below.

```html
<div class="button-group">
    <button class="button" type="button">Action</button>
    <button class="button" type="button"><span class="caret-down"></span></button>
</div>
```

### Sizes ###

Instead of applying size classes to individual buttons, a `.small` or `.large` class can be applied to the group.

```html
<div class="button-group small">
    ...
</div>
```

### Shapes ###

Like size classes, all shape classes can be applied to the group, this includes `.round`, `.pill`, `.oval`, and `.skew`.

```html
<div class="button-group pill">
    ...
</div>
```

<div class="notice is-warning">
    The <code>.pill</code>, <code>.oval</code>, and <code>.skew</code> classes will require
    effects extensions, which aren't part of the default build.
</div>

### Vertical Stacking ###

To stack buttons vertically instead of horizontally, we can use the `.button-group--vertical` modifier.

```html
<div class="button-group--vertical">
    ...
</div>
```

### Justified Alignment ###

To span the button group the width of the parent, and equally scale all buttons within,
we can use the `.button-group--justified` modifier.

```html
<div class="button-group--justified">
    ...
</div>
```

<div class="notice is-warning">
    Some browsers do not support <code>table-cell</code> display on <code>button</code> tags.
    Use <code>a</code> tags when using the justified modifier.
</div>

### Drop Integration ###

We can integrate dropdowns, dropups, droplefts, and droprights via the [Drop component](drop.md),
simply by placing a drop menu within the button group element.

```html
<div class="button-group" role="menu">
    <button class="button" type="button">Action</button>
    <button class="button" type="button" data-drop="#menu"><span class="caret-down"></span></button>

    <ul class="drop--down" id="menu">
        ...
    </ul>
</div>
```

The previous example will open a menu left aligned and below all buttons within the group.
If we want the menu to open up below the button that triggered it, we must use a list for the button group.

```html
<ul class="button-group" role="menu">
    <li><button class="button" type="button">Action</button></li>
    <li>
        <button class="button" type="button" data-drop="#menu"><span class="caret-down"></span></button>

        <ul class="drop--down" id="menu">
            ...
        </ul>
    </li>
</ul>
```

<div class="notice is-info">
    For drop menus to work, they must be initialized in the JavaScript layer.
    Implementation of the drop component may differ.
</div>