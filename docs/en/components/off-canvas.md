# Off Canvas #

Contextual sidebars positioned outside the viewport until activated.

## Usage ##

Off canvas provides a mechanism for positioning contextual sidebars outside of the viewport (on the left or right), which can then be slid into view when activated. Supporting off canvas sidebars is relatively easy.

The first thing we need to do is place a `.canvas` wrapper within the `body`, and within that an `.on-canvas` element where all site content should reside. Lastly, we place the `.off-canvas` sidebars within the wrapper.

```html
<body>
    <div class="canvas" data-offcanvas>
        <main class="on-canvas" data-offcanvas-content>
            ... Primary content ...
        </main>

        <aside class="off-canvas off-canvas--left" id="left-sidebar" data-offcanvas-sidebar="left">
            ... Sidebar content ...
        </aside>
    </div>
</body>
```

Once we have our markup, the component can be initialized on the sidebars.

```javascript
$('.off-canvas').offCanvas();
```

<div class="notice is-info">
   The <code>data-offcanvas-*</code> attributes are required so that the JavaScript layer
   can find or bind elements in the DOM.
</div>

<div class="notice is-info">
    The <code>data-offcanvas-sidebar</code> attribute must be set to either "left" or "right".
</div>

<div class="notice is-info">
    Mobile specific sidebars are supported through CSS media queries and Sass variables.
</div>

### Toggle Sidebars ###

When initializing a component, a `selector` option can be defined that will be bound with click toggle events.

```javascript
$('.off-canvas').offCanvas({
    selector: '.js-open-sidebar'
});
```

Or we can toggle the display manually through the component instance.

```javascript
$('#left-sidebar').toolkit('offCanvas', 'toggle');
```

### Multiple Sidebars ###

Supporting left and right sidebars is extremely easy. Simply duplicate the markup and JavaScript for each side.

```html
<aside class="off-canvas off-canvas--left" id="left-sidebar" data-offcanvas-sidebar="left">...</aside>
<aside class="off-canvas off-canvas--right" id="right-sidebar" data-offcanvas-sidebar="right">...</aside>
```

The component also supports multiple sidebars on the same side. However, be weary of this approach and the animations being used as it might run into weirdness.

```html
<aside class="off-canvas off-canvas--left" id="primary-sidebar" data-offcanvas-sidebar="left">...</aside>
<aside class="off-canvas off-canvas--left" id="secondary-sidebar" data-offcanvas-sidebar="left">...</aside>
```

### Animations ###

There are 7 types of animations that can be used for displaying a sidebar, each with their own unique presentation.

* `push` - Pushes the content off the screen to make room for the sidebar.
* `push-reveal` - A combination of the push and reveal animation.
* `push-down` - Pushes the content off the screen while the sidebar slides down from above.
* `reverse-push` - Similar to the push animation, but the sidebar slides in from the opposite side.
* `reveal` - The content slides off the screen to reveal the sidebar beneath it.
* `squish` - The content stays on screen, but is squished via padding to make room for the sidebar.
* `on-top` - The sidebar slides over the content.

```javascript
$('.off-canvas').offCanvas({
    animation: 'reverse-push'
});
```

### Open On Load ###

Sidebars can be opened on page load by setting `openOnLoad` to true.

```javascript
$('.off-canvas').offCanvas({
    openOnLoad: true
});
```

<div class="notice is-info">
    We suggest using this with the <code>on-top</code> or <code>squish</code> animations.
</div>

### Notes ###

* When a sidebar is open, an `.is-expanded` class will be added to the sidebar.
* When a sidebar is open, a `.move-left` or `.move-right` class will be added to the `.canvas`.

## ARIA ##

The `main` and `complementary` roles and the appropriate `aria-*` attributes are required when supporting ARIA.

```html
<main class="on-canvas" role="main" data-offcanvas-content>
    ...
</main>

<aside class="off-canvas off-canvas--left" role="complementary" data-offcanvas-sidebar="left">
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
            <td>$offCanvas-animations</td>
            <td>("push", "push-reveal", "push-down", "reverse-push", "reveal", "on-top", "squish")</td>
            <td>A list of all animations to include in the CSS output.</td>
        </tr>
        <tr>
            <td>$offCanvas-class</td>
            <td>.off-canvas</td>
            <td>CSS class name for the off canvas sidebar.</td>
        </tr>
        <tr>
            <td>$offCanvas-class-content</td>
            <td>.on-canvas</td>
            <td>CSS class name for the off canvas primary content wrapper.</td>
        </tr>
        <tr>
            <td>$offCanvas-class-wrapper</td>
            <td>.canvas</td>
            <td>CSS class name for the off canvas parent wrapper.</td>
        </tr>
        <tr>
            <td>$offCanvas-class-modifier-left</td>
            <td>.off-canvas--left</td>
            <td>CSS class name for the off canvas left modifier.</td>
        </tr>
        <tr>
            <td>$offCanvas-class-modifier-right</td>
            <td>.off-canvas--right</td>
            <td>CSS class name for the off canvas right modifier.</td>
        </tr>
        <tr>
            <td>$offCanvas-left-width</td>
            <td>20%</td>
            <td>The width of the left sidebar.</td>
        </tr>
        <tr>
            <td>$offCanvas-left-width-mobile</td>
            <td>90%</td>
            <td>The width of the left sidebar for mobile devices.</td>
        </tr>
        <tr>
            <td>$offCanvas-mobile-breakpoint</td>
            <td>640px</td>
            <td>The break point to apply mobile widths.</td>
        </tr>
        <tr>
            <td>$offCanvas-right-width</td>
            <td>20%</td>
            <td>The width of the right sidebar.</td>
        </tr>
        <tr>
            <td>$offCanvas-right-width-mobile</td>
            <td>90%</td>
            <td>The width of the right sidebar for mobile devices.</td>
        </tr>
        <tr>
            <td>$offCanvas-transition</td>
            <td>.5s</td>
            <td>The transition time for sidebar slide animations.</td>
        </tr>
        <tr>
            <td>$offCanvas-zindex</td>
            <td>250</td>
            <td>The z-index for the sidebar element.</td>
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
            <td>push</td>
            <td>
                Animation to use when displaying the sidebar.
                Accepts push, push-reveal, push-down, reverse-push, reveal, squish, on-top.
            </td>
        </tr>
        <tr>
            <td>hideOthers</td>
            <td>bool</td>
            <td>true</td>
            <td>Will hide all other sidebars when opening a sidebar.</td>
        </tr>
        <tr>
            <td>openOnLoad</td>
            <td>bool</td>
            <td>false</td>
            <td>
                Will automatically display the sidebar on page load.
                Transitions will not be triggered during this.
            </td>
        </tr>
        <tr>
            <td>selector</td>
            <td>string</td>
            <td></td>
            <td>CSS selector to bind click toggle events to.</td>
        </tr>
        <tr>
            <td>stopScroll</td>
            <td>bool</td>
            <td>true</td>
            <td>
                Whether to remove the scrollbar on the window while the sidebar is open.
                Requires <code>html.touch</code> for mobile devices to function properly.
            </td>
        </tr>
        <tr>
            <td>swipe</td>
            <td>bool</td>
            <td>Toolkit.isTouch</td>
            <td>Will bind swipe events. If this is true on non-touch devices, it will bind equivalent mouse events.</td>
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
            <td>resize</td>
            <td></td>
            <td>Triggered when the browser is resized.</td>
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
            <th>Found With</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>container</td>
            <td>element</td>
            <td>The parent element that contains the sidebar.</td>
            <td><code>parent</code></td>
        </tr>
        <tr>
            <td>opposite</td>
            <td>string</td>
            <td>The opposite of <code>side</code>.</td>
            <td></td>
        </tr>
        <tr>
            <td>primary</td>
            <td>element</td>
            <td>The primary element that contains the content.</td>
            <td>[data-offcanvas-content]</td>
        </tr>
        <tr>
            <td>secondary</td>
            <td>element</td>
            <td>The other sidebars within the canvas.</td>
            <td>[data-offcanvas-sidebar]</td>
        </tr>
        <tr>
            <td>side</td>
            <td>string</td>
            <td>The side where the sidebar is positioned. Will either be left or right.</td>
            <td></td>
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
            <th>Bound To</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>toggle()</td>
            <td>Toggle the display of the sidebar.</td>
            <td><code>selector</code> option</td>
        </tr>
    </tbody>
</table>
