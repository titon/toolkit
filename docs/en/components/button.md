# Button #

A typical button. You click it.

## Usage ##

The button component provides consistency and normalization of button-like elements between browsers. The `button`, `a`, and `input` tags are supported &mdash; simply add a `.button` class.

```html
<a class="button" href="javascript:;">Anchor</a>
<button class="button" type="button">Button</button>
<input class="button" type="button" value="Input">
<input class="button" type="submit" value="Submit">
```

For best practice, we recommend using the `button` and `a` tags whenever possible.

### Sizes ###

Require larger or smaller buttons? Adding a `.small` or `.large` class to the `.button` element will alter the padding and font size.

```html
<button class="button large" type="button">Large Button</button>
```

### Shapes ###

What about changing the border shape? Adding `.round`, `.pill`, `.oval`, or `.skew` classes to the `.button` element will change the border radius.

```html
<button class="button pill" type="button">Pill Button</button>
```

<div class="notice is-warning">
    All effects (excluding round) are disabled by default. Modify the <code>$button-effects</code> Sass variable to enable them.
</div>

### States ###

To disable a button, add the `.is-disabled` class &mdash; a `button` tag can simply use the `disabled` property. However, do note that adding the class to an anchor tag will not disable it, it only changes its style.

```html
<a class="button is-disabled" href="javascript:;">Disabled Anchor</a>
<button class="button" type="button" disabled>Disabled Button</button>
```

To mark a button as active, add the `.is-active` class. The `:active` pseudo is not defined by Toolkit.

```html
<button class="button is-active" type="button">Active Button</button>
```

When marking buttons as a specific actionable state, the global `.is-info`, `.is-success`, `.is-warning`, and `.is-error` classes can be used.

```html
<!-- Represents an informational action -->
<button class="button is-info" type="button">Info Button</button>

<!-- Represents a successful or position action -->
<button class="button is-success" type="button">Success Button</button>

<!-- Represents an action that requires caution -->
<button class="button is-warning" type="button">Warning Button</button>

<!-- Represents a dangerous or negative action -->
<button class="button is-error" type="button">Error Button</button>
```

<div class="notice is-warning">
    All state classes, excluding disabled, will require styling. The classes simply exist for semantic and structuring reasons.
</div>

### Modifiers ###

A modifier can be paired with a button to provide enhanced visual aesthetics. The following visuals are available:

* `.button--gloss` will apply a rounded glossy effect in the upper half of the button
* `.button--reflect` will apply a horizontal reflection with the upper half being masked
* `.button--glare` will apply a diagonal reflection with both halves fading into masks
* `.button--popout` will apply a border style that pops up the button, and pushes down when clicked

```html
<button type="button" class="button button--glare">Glared Button</button>
```

<div class="notice is-info">
    Visual modifiers make use of <code>::after</code> pseudo elements, so implementation requires the targeted element to not use pseudos.
</div>

<div class="notice is-warning">
    All modifiers are disabled by default. Modify the <code>$button-modifiers</code> Sass variable to enable them.
</div>

## ARIA ##

The `button` role and the appropriate `aria-*` attributes are required when supporting ARIA. [Learn more about this role.](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_button_role)

```html
<button class="button" type="button" role="button" aria-pressed="false">Button</button>
```

<div class="notice is-warning">
    JavaScript will be required to change the <code>aria-pressed</code> value.
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
            <td>$button-class</td>
            <td>.button</td>
            <td>CSS class name for the button element.</td>
        </tr>
        <tr>
            <td>$button-effects</td>
            <td>()</td>
            <td>List of effects to include in the CSS output. Accepts oval, pill, and skew.</td>
        </tr>
        <tr>
            <td>$button-modifiers</td>
            <td>()</td>
            <td>List of modifiers to include in the CSS output. Accepts gloss, reflect, glare, and popout.</td>
        </tr>
    </tbody>
</table>
