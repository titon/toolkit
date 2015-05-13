# Step #

Navigation grouped into consecutive steps.

## Usage ##

The stepped navigation makes use of `nav` and `ol` elements for semantic structuring. Each item in the list represents a single step out of multiple consecutive steps.

```html
<nav class="steps">
    <ol>
        <li><span class="step">Review</span></li>
        <li><span class="step">Shipping</span></li>
        <li><span class="step">Billing</span></li>
        <li><span class="step">Complete</span></li>
    </ol>
</nav>
```

### Completed Steps ###

An `.is-complete` class should be added to the parent `li` for every completed step.

```html
<li class="is-complete"><span class="step">Review</span></li>
```

### Linking Steps ###

An `a` tag can be used in place of a `span` to link steps or trigger JavaScript.

```html
<li><a href="#review" class="step">Review</a></li>
```

### Sizes ###

Adding a `.small` or `.large` class to the `.steps` element will alter the font size.

```html
<nav class="steps large">
    ...
</nav>
```

### Notes ###

* Style the `ol` instead of the wrapping `.steps` for inline block structuring.

## ARIA ##

The `navigation` role and the appropriate `aria-*` attributes are required when supporting ARIA.

```html
<nav class="steps" role="navigation" aria-label="Stepped Navigation">
    ...
</nav>
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
            <td>$step-class</td>
            <td>.step</td>
            <td>CSS class name for the individual step element.</td>
        </tr>
        <tr>
            <td>$step-class-wrapper</td>
            <td>.steps</td>
            <td>CSS class name for the steps list wrapper.</td>
        </tr>
    </tbody>
</table>
