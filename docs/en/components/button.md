# Button #

A typical button. You click it.

## Usage ##

The button component provides consistency and normalization of button-like elements between browsers.
The `button`, `a`, and `input` tags are supported &mdash; simply add a `.button` class.

```html
<a class="button" href="javascript:;">Anchor</a>
<button class="button" type="button">Button</button>
<input class="button" type="button" value="Input">
<input class="button" type="submit" value="Submit">
```

For best practice, we recommend using the `button` and `a` tags whenever possible.

### Sizes ###

Require larger or smaller buttons? Adding a `.small` or `.large` class to the `.button` element
will alter the padding and font size.

```html
<button class="button large" type="button">Large Button</button>
```

### Shapes ###

What about changing the border shape? Adding `.square` (default), `.round`, `.pill`, `.oval`,
or `.skew` classes to the `.button` element will change the border radius.

```html
<button class="button pill" type="button">Pill Button</button>
```

<div class="notice is-warning">
    The <code>.pill</code>, <code>.oval</code>, and <code>.skew</code> classes will require
    effects extensions, which aren't part of the default build.
</div>

### States ###

To disable a button, add the `.is-disabled` class &mdash; a `button` tag can simply use the `disabled` property.
However, do note that adding the class to an anchor tag will not disable it, it only changes its style.

```html
<a class="button is-disabled" href="javascript:;">Disabled Anchor</a>
<button class="button" type="button" disabled>Disabled Button</button>
```

To mark a button as active, add the `.is-active` class. The `:active` pseudo is not defined by Toolkit.

```html
<button class="button is-active" type="button">Active Button</button>
```

When marking buttons as a specific actionable state, the global `.is-info`, `.is-success`, `.is-warning`,
and `.is-error` classes can be used.

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
    All state classes, excluding disabled, will require styling.
    The classes simply exist for semantic and structuring reasons.
</div>

### Effects ###

For fancy visual aesthetics, the `.visual-gloss`, `.visual-reflect`, `.visual-glare`, and `.visual-popout`
effects can be used. These visuals make use of `:after` pseudo elements to apply their effect.

<div class="notice is-warning">
    These classes require the visual effects extension, which isn't part of the default build.
</div>