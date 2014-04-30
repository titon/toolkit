# Base #

Defines styles and helper classes for CSS, and a robust component system for JavaScript.

## Usage ##

The base component is required by all other components, as it provides base CSS styles and
the [JavaScript Component layer](../development/js/component.md). In regards to CSS, the following
global classes are available for use.

### Alignment ###

For text alignment, the `.align-left`, `.align-center`, `.align-right`, and `.align-justify`
classes can be used.

```html
<p class="align-center">This message is so important, it must be centered!</p>
```

For floating an element on a use case basis, the `.float-left`, `.float-right`, and
`.float-none` classes can be used.

```html
<time class="float-right">Feb 26th</time>
```

### Animation ###

To trigger CSS transitions or animations, the `.show` and `.hide` classes can be toggled.
These classes are automatically handled through `conceal()` and `reveal()` within the
JavaScript layer.

For implementing a fade transition on an element, set the initial visibility to hidden,
opacity to 0, and add the transition properties. Once `.show` is toggled, fading will occur.

```css
.element {
    visibility: hidden;
    opacity: 0;
    transition: opacity .3s, visibility .3s;
}
```

<div class="notice is-warning">
    These classes should <b>rarely</b> be modified.
</div>

To disable transitions programmatically on an element, add `.no-transition` to the element.

```html
<div class="element no-transition">Transitions are now disabled.</div>
```

### Display ###

To mark an element as display block, use `.shown`, or to hide an element, use `.hidden`.

```html
<div class="hidden">Can't see this!</div>
```

To hide an element but make it readable by screen readers, add `.sr-only`.
Can also add `.is-focusable` to the element to make it revealable.

```html
<div class="sr-only">Only screen readers can see this!</div>
```

### Layout ###

To position an element directly in the center, horizontally and vertically, use `.vertical-center`.
This class requires the parent to have a relative position.

For instances where a parent needs to clear floats dynamically, the `.clear-fix` class is available.

```html
<div class="clear-fix">
    <div class="float-left">...</div>
    <div class="float-right">...</div>
</div>
```

### States ###

When an item is marked as disabled, either through the `.is-disabled` class, or the `disabled` property,
the cursor will be changed to `not-allowed`.

```html
<button type="button" disabled>Can't touch this!</button>
```

Or when an element is being dragged, the `.is-draggable` and `.is-dragging` classes will apply `move`
and `dragging` cursors respectively.

### Carets ###

Carets are tiny directional arrows used by many components, like [Input](input.md) selects, [Drops](drop.md),
and [Flyouts](flyout.md). They make use of border styles to create their arrow effect. The following carets exist:
`.caret-up`, `.caret-right`, `.caret-down`, and `.caret-left`.

```html
<a href="#">View More <span class="caret-right"></span></a>
```

### Sorter ###

A sorter is a stacking of `.caret-up` and `.caret-down` elements to create an ascending and descending sorter,
most commonly used in table headers. Applying an `.asc` or `.desc` class to the sorter will update styles accordingly.

```html
<span class="sorter asc">
    <span class="caret-up"></span>
    <span class="caret-down"></span>
</span>
```

### Arrows ###

Similar to carets, arrows are used as directional indicators. The difference between carets and arrows, is that arrows
use the `&blacktriangle;` HTML5 entity (not all browsers support this). Arrows are much larger than carets, as they
scale automatically with font sizes. However, arrow classes may be removed in future versions as their use is limited.

The following arrows exist: `.arrow-up`, `.arrow-right`, `.arrow-down`, and `.arrow-left`.

```html
<span class="arrow-left"></span>
```

### Characters ###

A character is just that, a character. The only currently supported character is `.x`, which uses the `&times;` entity
to create X's used in close buttons.

```html
<span class="x"></span>
```

### Bullets ###

Bullets are an inline horizontal list that use tiny circles as indicators. A bullet list is used in the
[Carousel](carousel.md) and [Showcase](showcase.md) for indicating the number of items in the component.

```html
<ol class="bullets">
    <li><a href=""></a></li>
    <li><a href=""></a></li>
    <li><a href=""></a></li>
</ol>
```