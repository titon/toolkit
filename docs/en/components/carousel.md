# Carousel #

Cycles through items using a slide or fade animation.

## Usage ##

Manual implementation of the carousel markup is required, as there is no
automatic generation of elements in the JavaScript layer. The reasoning behind this is simple.
It allows elements within the carousel to be added or removed easily,
without having to alter options in JavaScript, or define overrides in CSS.
The following markup can be used for basic carousel functionality.

```html
<div class="carousel">
    <!-- Items to cycle -->
    <div class="carousel-items">
        <ul>
            <li><a href=""><img src="/img/carousel/item-1.png" alt="" class="fluid"></a></li>
            ...
        </ul>
    </div>

    <!-- Tabs for each item -->
    <div class="carousel-tabs">
        <ol class="bullets">
            <li><a href="javascript:;"></a></li>
            ...
        </ol>
    </div>

    <!-- Next and previous arrows -->
    <a href="javascript:;" class="carousel-prev"></a>
    <a href="javascript:;" class="carousel-next"></a>
</div>
```

If we don't want next and previous arrows, don't add the markup for it.
If we don't want the tab list, don't add the markup for it.
If we want additional elements, we can freely add them! So on and so forth.
The only elements that are required, are the `.carousel` wrapper,
and the `.carousel-items` list.

Once the markup is in place, a carousel can be initialized.

```javascript
$('.carousel').carousel();
```

### Cycle Animation ###

There are 3 kinds of animation, `slide` (default), `slide-up`, and `fade`.
The type of animation must be passed as an option when the carousel is initialized.

```javascript
$('.carousel').carousel({
    animation: 'slide-up'
});
```

The `.carousel` element will receive a class with the animation name.
This allows for styling based on the type of animation used.

<div class="notice is-error">
    Toolkit makes use of CSS3 transitions for animation, which older browsers do not support.
    Instead of animations in these browsers, an immediate show or hide will occur.
</div>

### Aspect Ratios ###

By default the carousel is designed for a 4:3 aspect ratio.
To use a 16:9 aspect ratio, the `.carousel--wide` modifier can be used.

```html
<div class="carousel--wide">
    ...
<div>
```

To use a 1:1 (square) aspect ratio, the `.carousel--square` modifier can be used.

```html
<div class="carousel--square">
    ...
<div>
```

To use a custom aspect ratio, or to use a fixed height, modify the `padding-bottom`
on `.carousel-items`. For example, the 4:3 has a bottom padding of 75%,
while the 16:9 has a value of 56.25%, and the 1:1 has a value of 100%.
This technique allows for automatic height scaling based on the width of the carousel.

### Responsive Support ###

The carousel was designed with responsiveness in mind by utilizing percentages and a fluid structure.
We suggest using inline images within each carousel item, sized to the correct aspect ratio (above).
The carousel will take care of everything else.

### Optional Captions ###

Add captions to the carousel by adding a `.carousel-caption` element within each item.
The markup within a caption can be customized extensively and is not enforced by the carousel.

```html
<li>
    <a href=""><img src="/img/carousel/item-1.png" alt=""></a>

    <div class="carousel-caption">
        <h3>Caption Title</h3>
        <p>Lipsum dolor sit amet.</p>
    </div>
</li>
```

### Notes ###

* The currently shown index will have an `.is-active` class applied to the respective tab.
* Modifying `padding-bottom` on `.carousel-items` allows for fixed or custom heights.
* Supports arrow and escape key events.

## ARIA ##

The `tab`, `tablist`, and `tabpanel` roles, and the appropriate `aria-*`
attributes are required when supporting ARIA.

```html
<div class="carousel">
    <div class="carousel-items">
        <ul>
            <li role="tabpanel">...</li>
        </ul>
    </div>

    <div class="carousel-tabs" role="tablist">
        <ol class="bullets">
            <li><a href="javascript:;" role="tab"></a></li>
        </ol>
    </div>
</div>
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
            <td>$carousel-opacity</td>
            <td>0.50</td>
            <td>The alpha transparency for the carousel caption element.</td>
        </tr>
        <tr>
            <td>$carousel-transition</td>
            <td>1s</td>
            <td>The transition time for all carousel animations.</td>
        </tr>
    </tbody>
</table>

## Options ##

Inherits all options from the [parent component](../development/js/component.md#options).

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
            <td>slide</td>
            <td>
                The type of animation to use for cycling. Accepts slide, slide-up, and fade.
            </td>
        </tr>
        <tr>
            <td>duration</td>
            <td>int</td>
            <td>5000</td>
            <td>The time in milliseconds when each cycle occurs.</td>
        </tr>
        <tr>
            <td>autoCycle</td>
            <td>bool</td>
            <td>true</td>
            <td>Whether to cycle through items automatically. Makes use of <code>duration</code> for intervals.</td>
        </tr>
        <tr>
            <td>stopOnHover</td>
            <td>bool</td>
            <td>true</td>
            <td>Whether to pause the automatic cycling while hovering over the carousel.</td>
        </tr>
    </tbody>
</table>

## Events ##

Inherits all events from the [parent component](../development/js/component.md#events).

<table class="table is-striped data-table">
    <thead>
        <tr>
            <th>Option Event</th>
            <th>Element Event</td>
            <th>Arguments</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>onJump</td>
            <td>jump.toolkit.carousel</td>
            <td>int:index</td>
            <td>Triggered after an item is cycled into view. Applies to all next, previous, and cycle calls.</td>
        </tr>
        <tr>
            <td>onStart</td>
            <td>start.toolkit.carousel</td>
            <td></td>
            <td>Triggered when the carousel cycle has started. Can be triggered by <code>start()</code> or <code>stopOnHover</code>.</td>
        </tr>
        <tr>
            <td>onStop</td>
            <td>stop.toolkit.carousel</td>
            <td></td>
            <td>Triggered when the carousel cycle has stopped. Can be triggered by <code>stop()</code> or  <code>stopOnHover</code>.</td>
        </tr>
        <tr>
            <td>onCycle</td>
            <td>cycle.toolkit.carousel</td>
            <td></td>
            <td>Triggered when <code>autoCycle</code> is enabled, immediately before the next item is cycled.</td>
        </tr>
    </tbody>
</table>

## Properties ##

Inherits all properties from the [parent component](../development/js/component.md#properties).

<table class="table is-striped data-table">
    <thead>
        <tr>
            <th>Property</th>
            <th>Type</th>
            <th>Description</th>
            <th>Found With</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>items</td>
            <td>collection</td>
            <td>A collection of item elements that will be cycled through.</td>
            <td>.carousel-items li</td>
        </tr>
        <tr>
            <td>tabs</td>
            <td>collection</td>
            <td>A collection of tab elements that can be clicked to jump to items.</td>
            <td>.carousel-tabs a</td>
        </tr>
        <tr>
            <td>index</td>
            <td>int</td>
            <td>The index of the currently shown item.</td>
            <td></td>
        </tr>
        <tr>
            <td>timer</td>
            <td>int</td>
            <td>The automatic cycle timer instance.</td>
            <td></td>
        </tr>
        <tr>
            <td>stopped</td>
            <td>bool</td>
            <td>Has the carousel stopped cycling.</td>
            <td></td>
        </tr>
    </tbody>
</table>

## Methods ##

Inherits all methods from the [parent component](../development/js/component.md#methods).

<table class="table is-striped data-table">
    <thead>
        <tr>
            <th>Method</th>
            <th>Description</th>
            <th>Bound To</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>jump(int:index)</td>
            <td>Go to a specific item defined by the index in the collection.</td>
            <td>.carousel-tabs a</td>
        </tr>
        <tr>
            <td>next()</td>
            <td>Go to the next item.</td>
            <td>.carousel-next</td>
        </tr>
        <tr>
            <td>prev()</td>
            <td>Go to the previous item.</td>
            <td>.carousel-prev</td>
        </tr>
        <tr>
            <td>start()</td>
            <td>
                Start automatic cycling.
                This method is triggered automatically when <code>stopOnHover</code> is enabled,
                and the mouse leaves the carousel.
            </td>
            <td></td>
        </tr>
        <tr>
            <td>stop()</td>
            <td>
                Stop automatic cycling.
                This method is triggered automatically when <code>stopOnHover</code> is enabled,
                and the mouse enters the carousel.
            </td>
            <td></td>
        </tr>
        <tr>
            <td>reset()</td>
            <td>Reset the cycling timer.</td>
            <td></td>
        </tr>
    </tbody>
</table>