# Switch #

Binary switch for on and off states.

## Usage ##

A switch is a replacement for standard checkboxes where a binary choice is represented with a visual on or off state.
To enable switches, wrap all checkboxes with the following markup.

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
    Labels are rendered using <code>attr()</code> with <code>::before</code> (on state)
    and <code>::after</code> (off state) pseudo elements.
</div>

### Stacked Labels ###

By default, the inactive label is hidden by the sliding toggle.
To place labels on top of the toggle, add the `.switch--stacked` modifier to `.switch`.

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

Adding `.round` or `.pill` to the `.switch` will alter the border radius.

```html
<label class="switch pill">
    ...
</label>
```

<div class="notice is-warning">
    The <code>.pill</code> shape will require the pill effect.
</div>

## Notes ##

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
            <td>$switch-transition</td>
            <td>.3s</td>
            <td>The transition time for toggle sliding and switch fading.</td>
        </tr>
    </tbody>
</table>