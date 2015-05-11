# Progress #

A progress bar. It shows the progress of something.

## Usage ##

Provide visual feedback on the progress of an action by utilizing simple progress bars. The width of a progress bar should be defined inline using a `width` style property.

```html
<div class="progress">
    <div class="progress-bar" style="width: 45%">
        45%
    </div>
</div>
```

The label within a progress bar is optional, but when present, will be centered within the bar. Applying a `min-width` on the progress bar will ensure visibility at small widths.

### Sizes ###

Alter the size of a progress bar by adding `.small` or `.large` classes.

```html
<div class="progress large">
    ...
</div>
```

### Shapes ###

Re-shape the outer edges of a progress bar by adding `.round` or `.pill` effects.

```html
<div class="progress pill">
    ...
</div>
```

### States ###

Provide contextual feedback on the type of progress by using the global state classes.

```html
<div class="progress">
    <div class="progress-bar is-info">...</div>
</div>

<div class="progress">
    <div class="progress-bar is-success">...</div>
</div>

<div class="progress">
    <div class="progress-bar is-warning">...</div>
</div>

<div class="progress">
    <div class="progress-bar is-error">...</div>
</div>
```

<div class="notice is-warning">
    All state classes will require styling. The classes simply exist for semantic and structuring reasons.
</div>

### Stacked Bars ###

Place multiple bars within a `.progress` to stack them horizontally.

```html
<div class="progress">
    <div class="progress-bar is-success" style="width: 44%">264</div>
    <div class="progress-bar is-error" style="width: 56%">600</div>
</div>
```

## ARIA ##

The `progressbar` role and the appropriate `aria-*` attributes are required when supporting ARIA. [Learn more about this role.](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_progressbar_role)

```html
<div class="progress" role="progressbar" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100">
    <div class="progress-bar" style="width: 45%">
        45%
    </div>
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
            <td>$progress-class</td>
            <td>.progress</td>
            <td>CSS class name for the progress wrapper.</td>
        </tr>
        <tr>
            <td>$progress-class-bar</td>
            <td>.progress-bar</td>
            <td>CSS class name for the progress bar element.</td>
        </tr>
        <tr>
            <td>$progress-effects</td>
            <td>("pill")</td>
            <td>List of effects to include in the CSS output. Accepts pill.</td>
        </tr>
        <tr>
            <td>$progress-transition</td>
            <td>.5s</td>
            <td>The transition time for progress bar with and background animations.</td>
        </tr>
    </tbody>
</table>
