# Base Styles #

Defines CSS styles and helper classes.

## Alignment ##

For text alignment, the `.align-left`, `.align-center`, `.align-right`, and `.align-justify` classes can be used.

```html
<p class="align-center">This message is so important, it must be centered!</p>
```

For floating an element on a use case basis, the `.float-left`, `.float-right`, and `.float-none` classes can be used.

```html
<time class="float-right">Feb 26th</time>
```

By default, alignment does not respect RTL mode. To rectify this, there are start and end classes that orient themselves automatically.

```html
<div class="align-start">This is aligned to the start direction of RTL mode.</div>
<div class="float-end">This is aligned in the opposite direction.</div>
```

## Animation ##

To trigger CSS transitions or animations, the `.show` and `.hide` classes can be toggled. These classes are automatically handled through `conceal()` and `reveal()` within the JavaScript layer.

For implementing a fade transition on an element, set the initial visibility to hidden, opacity to 0, and add the transition properties. Once `.show` is toggled, fading will occur.

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

## Display ##

To mark an element as display block, use `.shown`, or to hide an element, use `.hidden`.

```html
<div class="hidden">Can't see this!</div>
```

To hide an element but make it readable by screen readers, add `.sr-only`. Can also add `.is-focusable` to the element to make it revealable.

```html
<div class="sr-only">Only screen readers can see this!</div>
```

## Layout ##

To position an element directly in the center, horizontally and vertically, use `.vertical-center`. This class requires the parent to have a relative position.

For instances where a parent needs to clear floats dynamically, the `.clear-fix` class is available.

```html
<div class="clear-fix">
    <div class="float-left">...</div>
    <div class="float-right">...</div>
</div>
```

## States ##

When an item is marked as disabled, either through the `.is-disabled` class, or the `disabled` property, the cursor will be changed to `not-allowed`.

```html
<button type="button" disabled>Can't touch this!</button>
```

Or when an element is being dragged, the `.is-draggable` and `.is-dragging` classes will apply `move` and `dragging` cursors respectively.

## Carets ##

Carets are tiny directional arrows used by many components, like [Input](../../components/input.md) selects, [Drops](../../components/drop.md), and [Flyouts](../../components/flyout.md). They make use of border styles to create their arrow effect. The following carets exist: `.caret-up`, `.caret-right`, `.caret-down`, and `.caret-left`.

```html
<a href="#">View More <span class="caret-right"></span></a>
```

## Sorter ##

A sorter is a stacking of `.caret-up` and `.caret-down` elements to create an ascending and descending sorter, most commonly used in table headers. Applying an `.asc` or `.desc` class to the sorter will update styles accordingly.

```html
<span class="sorter asc">
    <span class="caret-up"></span>
    <span class="caret-down"></span>
</span>
```

## Characters ##

A character is just that, a character. The only currently supported character is `.x`, which uses the `&times;` entity to create X's used in close buttons.

```html
<span class="x"></span>
```

## Bullets ##

Bullets are an inline horizontal list that use tiny circles as indicators. A bullet list is used in the [Carousel](../../components/carousel.md) and [Showcase](../../components/showcase.md) for indicating the number of items in the component.

```html
<ol class="bullets">
    <li><a href=""></a></li>
    <li><a href=""></a></li>
    <li><a href=""></a></li>
</ol>
```

## Sizes ##

A `.span-*` class can be used to force a percentage based width on an element. There are 12 spans, with the lowest span equating to 8.3% and the highest span equating to 100%. These spans are handy when controlling input sizes, or building columns with the [Grid component](../../components/grid.md).

```html
<input type="text" class="input span-6" name="name">
```

## RTL ##

Adding `dir="rtl"` or `.rtl` to an element will enable RTL reading mode. We suggest adding this attribute to the base `<html>` tag. [Learn more about RTL languages.](../rtl.md)

```html
<html lang="ar" dir="rtl">
```

## Fluid Media ##

Supporting inline images and videos within a responsive website can be tedious. To mitigate this issue, Toolkit provides a `.fluid` class that applies a `max-width` of 100% with auto-scaling heights.

```html
<img src="/path/to/image.png" class="fluid" alt="">
```

Furthermore, to support videos and embeds, the `.fluid-media` wrapper can be used. This will responsively and fluidly display a video in 16:9 aspect ratio.

```html
<div class="fluid-media">
    <iframe src="/path/to/video.ogg" frameborder="0" allowfullscreen></iframe>
</div>
```
