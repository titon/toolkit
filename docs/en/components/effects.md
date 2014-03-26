# Effects #

A collection of optional effects for components.

## Usage ##

Effects are simply classes that can be applied to other components to provide new aesthetics or functionality.
However, effects are optional, and are **not** included in the default distribution files or build.
Effects will need to be manually defined during the [Grunt build process](../setup/custom-builds.md#including-effects).

### Shapes ###

Applying a shape class to a [button](button.md), [button group](button-group.md), [pagination](pagination.md),
[progress bar](progress.md), and [switch](switch.md) will alter the border styles to be more aesthetically pleasing.
The following shapes are available:

* `.pill` will alter the shape to that of a medicine pill
* `.oval` will alter the shape into an oval (not always 100%)
* `.skew` will alter the shape into something similar to a manilla folder tab

```html
<button type="button" class="button pill">Pill Button</button>
```

<div class="notice is-warning">
    Each shape will need to be individually included during the Grunt build process.
</div>

<div class="notice is-error">
    Not all shapes are available for all the components listed above.
</div>

### Visuals ###

A visual effect can be paired with a [button](button.md) to provide enhanced visual aesthetics.
The following visuals are available:

* `.visual-gloss` will apply a rounded glossy effect in the upper half of the button
* `.visual-reflect` will apply a horizontal reflection with the upper half being masked
* `.visual-glare` will apply a diagonal reflection with both halves fading into masks
* `.visual-popout` will apply a border style that pops up the button, and pushes down when clicked

```html
<button type="button" class="button visual-glare">Glared Button</button>
```

<div class="notice is-info">
    Visual effects make use of <code>:after</code> pseudo elements,
    so implementation requires the targeted element to not use pseudos.
</div>

<div class="notice is-warning">
    All visual effects are included during the Grunt build process, simply pass "visual" as the key.
</div>

<div class="notice is-error">
    Visual effects will only work with buttons and anchors within the button component.
</div>