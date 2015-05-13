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

The most common use case for button groups is creating split buttons. A split button is a grouping of 2 buttons, one of which is an action, and the other opens a menu. More information on drop menus can be found below.

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
    All effects (excluding round) are disabled by default. Modify the <code>$buttonGroup-effects</code> Sass variable to enable them.
</div>

### Vertical Stacking ###

To stack buttons vertically instead of horizontally, we can use the `.button-group--vertical` modifier.

```html
<div class="button-group button-group--vertical">
    ...
</div>
```

### Justified Alignment ###

To span the button group the width of the parent, and equally scale all buttons within, we can add the `.button-group--justified` modifier.

```html
<div class="button-group button-group--justified">
    ...
</div>
```

<div class="notice is-warning">
    Some browsers do not support <code>table-cell</code> display on <code>button</code> tags. Use <code>a</code> tags when using the justified modifier.
</div>

### Drop Integration ###

We can integrate dropdowns, dropups, droplefts, and droprights via the [Drop component](drop.md), simply by placing a drop menu within the button group element.

```html
<div class="button-group">
    <button class="button" type="button">Action</button>
    <button class="button" type="button" data-drop="#menu"><span class="caret-down"></span></button>

    <ul class="drop drop--down" id="menu">
        ...
    </ul>
</div>
```

The previous example will open a menu left aligned and below all buttons within the group. If we want the menu to open up below the button that triggered it, we must use a list for the button group.

```html
<ul class="button-group">
    <li><button class="button" type="button">Action</button></li>
    <li>
        <button class="button" type="button" data-drop="#menu"><span class="caret-down"></span></button>

        <ul class="drop drop--down" id="menu">
            ...
        </ul>
    </li>
</ul>
```

<div class="notice is-info">
    For drop menus to work, they must be initialized in the JavaScript layer. Implementation of the Drop component may differ.
</div>

## ARIA ##

The `toolbar` role and the appropriate `aria-*` attributes are required when supporting ARIA.

```html
<div class="button-group" role="toolbar" aria-label="Toolbar">
    ...
</div>
```

When using the vertical modifier, the `aria-orientation` attribute must be defined.

```html
<div class="button-group button-group--vertical" role="toolbar" aria-label="Toolbar" aria-orientation="vertical">
    ...
</div>
```

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
            <td>$buttonGroup-class</td>
            <td>.button-group</td>
            <td>CSS class name for the button group element.</td>
        </tr>
        <tr>
            <td>$buttonGroup-class-modifier-justified</td>
            <td>.button-group--justified</td>
            <td>CSS class name for the button group justified modifier.</td>
        </tr>
        <tr>
            <td>$buttonGroup-class-modifier-vertical</td>
            <td>.button-group--vertical</td>
            <td>CSS class name for the button group vertical modifier.</td>
        </tr>
        <tr>
            <td>$buttonGroup-effects</td>
            <td>()</td>
            <td>List of effects to include in the CSS output. Accepts pill and skew.</td>
        </tr>
        <tr>
            <td>$buttonGroup-modifiers</td>
            <td>("vertical", "justified")</td>
            <td>List of modifiers to include in the CSS output. Accepts vertical and justified.</td>
        </tr>
    </tbody>
</table>
