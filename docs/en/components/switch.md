# Switch #

Binary switch for on and off states.

## Usage ##

A switch is a replacement for standard checkboxes where a binary choice is represented with a visual on or off state. To enable switches, wrap all checkboxes with the following markup.

```html
<label class="switch" for="checkbox">
    <!-- Original checkbox -->
    <input type="checkbox" name="setting" id="checkbox" value="1">

    <!-- Toggle bar -->
    <span class="switch-bar">
        <span class="switch-toggle"></span>
    </span>
</label>
```

<div class="notice is-warning">
    The wrapping <code>label</code> and order of elements is mandatory.
</div>

### Disabled Switch ###

To disable a switch, add `disabled` to the input and `.is-disabled` to `.switch`.

```html
<label class="switch is-disabled">
    <input type="checkbox" disabled>
    ...
</label>
```

### Custom Labels ###

To add labels for the on and off states, specific data attributes on `.switch-bar` can be defined.

```html
<span class="switch-bar" data-switch-on="On" data-switch-off="Off">
    ...
</span>
```

<div class="notice is-info">
    Labels are rendered using <code>attr()</code> with <code>::before</code> (on state) and <code>::after</code> (off state) pseudo elements.
</div>

### Stacked Labels ###

By default, the inactive label is hidden by the sliding toggle. To place labels on top of the toggle, add the `.switch--stacked` modifier to `.switch`.

```html
<label class="switch switch--stacked">
    ...
</label>
```

### Sizes ###

Adding `.small` or `.large` to the `.switch` will alter the font size, padding, and height.

```html
<label class="switch small">
    ...
</label>
```

### Shapes ###

Adding `.round` or `.pill` to the `.switch-bar` will alter the border radius.

```html
<label class="switch">
    ...

    <div class="switch-bar pill">...</div>
</label>
```

### Notes ###

* Switches use `:checked` on the original checkbox for their on state.

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
            <td>$switch-class</td>
            <td>.switch</td>
            <td>CSS class name for the switch element.</td>
        </tr>
        <tr>
            <td>$switch-class-bar</td>
            <td>.switch-bar</td>
            <td>CSS class name for the switch bar that wraps the toggle.</td>
        </tr>
        <tr>
            <td>$switch-class-toggle</td>
            <td>.switch-toggle</td>
            <td>CSS class name for the switch toggle button.</td>
        </tr>
        <tr>
            <td>$switch-class-modifier-stacked</td>
            <td>.switch--stacked</td>
            <td>CSS class name for the switch stacked modifier.</td>
        </tr>
        <tr>
            <td>$switch-effects</td>
            <td>("pill")</td>
            <td>List of effects to include in the CSS output. Accepts pill.</td>
        </tr>
        <tr>
            <td>$switch-modifiers</td>
            <td>("stacked")</td>
            <td>List of modifiers to include in the CSS output. Accepts stacked.</td>
        </tr>
        <tr>
            <td>$switch-transition</td>
            <td>.3s</td>
            <td>The transition time for toggle sliding and switch fading.</td>
        </tr>
    </tbody>
</table>
