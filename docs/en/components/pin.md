# Pin #

Pin an element within the bounds of its parent and follow the position of the scroll.

## Usage ##

Pinning an element to stay within the viewport or within a parent, during a resize or scroll, is especially handy for side navigation, or top bar menus. Simply initialize a pin on the element we want pinned.

```javascript
$('.pin').pin();
```

### Animations ###

By default, no animations are set on the pinned element. This will cause choppiness while scrolling unless the `throttle` is lowered. To solve this, set an animation, either `sticky` or `slide`.

```javascript
$('.pin').pin({
    animation: 'slide'
});
```

A slide animation will slowly animate to the new coordinates. A sticky animation will do the same, but will "bounce" before animating.

<div class="notice is-info">
    The <code>.pin</code> class is required for animations to work correctly.
</div>

### Bounding Container ###

A pinned element will be bound within its parent element, which means it wont overflow outside the parent. To change the container, set the `context` option.

```javascript
$('.pin').pin({
    animation: 'sticky',
    context: '#container'
});
```

<div class="notice is-warning">
    The container requires position <code>relative</code>.
</div>

### Notes ###

* An `.is-pinned` class will be toggled when the pinned element re-positions.

## ARIA ##

The `complementary` role and the appropriate `aria-*` attributes are required when supporting ARIA.

```html
<aside class="pin" role="complementary">
    ...
</aside>
```

<div class="notice is-info">
    The JavaScript component will automatically map all ARIA attributes.
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
            <td>$pin-class</td>
            <td>.pin</td>
            <td>CSS class name for the pinned element.</td>
        </tr>
        <tr>
            <td>$pin-transition</td>
            <td>.2s</td>
            <td>The transition time for pinned element position animations.</td>
        </tr>
    </tbody>
</table>

## Options ##

Inherits all options from the [parent Component](component.md#options).

<table class="table is-striped data-table">
    <thead>
        <tr>
            <th>Option</th>
            <th>Type</th>
            <th>Default</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>animation</td>
            <td>string</td>
            <td></td>
            <td>
                The type of animation to use when scrolling down the page.
                Accepts slide, sticky, or an empty value.
            </td>
        </tr>
        <tr>
            <td>calculate</td>
            <td>bool</td>
            <td>false</td>
            <td>
                Re-calculate offsets, widths, heights, and viewport while scrolling.
                May slow down the page while active, so trigger <code>calculate()</code> manually when needed.
            </td>
        </tr>
        <tr>
            <td>fixed</td>
            <td>bool</td>
            <td>false</td>
            <td>
                Whether to use position fixed or not while scrolling.
                Fixed pins will not animate.
            </td>
        </tr>
        <tr>
            <td>location</td>
            <td>string</td>
            <td>right</td>
            <td>
                The horizontal location to use when positioning.
                Accepts left or right.
            </td>
        </tr>
        <tr>
            <td>lock</td>
            <td>bool</td>
            <td>true</td>
            <td>
                Whether to deactivate pinning if the target element is larger than the viewport.
            </td>
        </tr>
        <tr>
            <td>throttle</td>
            <td>int</td>
            <td>50</td>
            <td>The time in milliseconds to throttle the page scroll events.</td>
        </tr>
        <tr>
            <td>xOffset</td>
            <td>int</td>
            <td>0</td>
            <td>The offset in pixels to move the pin along the X axis.</td>
        </tr>
        <tr>
            <td>yOffset</td>
            <td>int</td>
            <td>0</td>
            <td>The offset in pixels to move the pin along the Y axis.</td>
        </tr>
    </tbody>
</table>

## Events ##

Inherits all events from the [parent Component](component.md#events).

<table class="table is-striped data-table">
    <thead>
        <tr>
            <th>Event</td>
            <th>Arguments</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>pinned</td>
            <td></td>
            <td>Triggered when the element is positioned.</td>
        </tr>
        <tr>
            <td>resize</td>
            <td></td>
            <td>Triggered when the page is resized, and after calculations have been executed.</td>
        </tr>
        <tr>
            <td>scroll</td>
            <td></td>
            <td>Triggered when the page is scrolled, and after the pin has been positioned.</td>
        </tr>
        <tr>
            <td>unpinned</td>
            <td></td>
            <td>Triggered when the element is reset to its original state.</td>
        </tr>
    </tbody>
</table>

## Properties ##

Inherits all properties from the [parent Component](component.md#properties).

<table class="table is-striped data-table">
    <thead>
        <tr>
            <th>Property</th>
            <th>Type</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>active</td>
            <td>bool</td>
            <td>Will the element be pinned? Depends on the heights of the parent and element.</td>
        </tr>
        <tr>
            <td>elementHeight</td>
            <td>int</td>
            <td>The height of the pinned element.</td>
        </tr>
        <tr>
            <td>elementTop</td>
            <td>int</td>
            <td>The initial top offset value of the element.</td>
        </tr>
        <tr>
            <td>parentHeight</td>
            <td>int</td>
            <td>The height of the parent element.</td>
        </tr>
        <tr>
            <td>parentTop</td>
            <td>int</td>
            <td>The initial top offset value of the parent element.</td>
        </tr>
        <tr>
            <td>pinned</td>
            <td>bool</td>
            <td>Whether the element is positioned or not.</td>
        </tr>
        <tr>
            <td>initialTop</td>
            <td>int</td>
            <td>The CSS top value of the element.</td>
        </tr>
        <tr>
            <td>viewport</td>
            <td>object</td>
            <td>The current width and height of the viewport (window object).</td>
        </tr>
    </tbody>
</table>

## Methods ##

Inherits all methods from the [parent Component](component.md#methods).

<table class="table is-striped data-table">
    <thead>
        <tr>
            <th>Method</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>calculate()</td>
            <td>
                Calculate the dimensions and offsets of elements used by the pin.
            </td>
        </tr>
        <tr>
            <td>pin()</td>
            <td>
                Pin the element based on the current parent and element dimensions and the position of the scroll.
            </td>
        </tr>
        <tr>
            <td>unpin()</td>
            <td>
               Unpin the element and reset position to its original state.
            </td>
        </tr>
    </tbody>
</table>
