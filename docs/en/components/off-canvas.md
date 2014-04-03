# Off Canvas #

Contextual sidebars positioned outside the viewport until activated.

## Usage ##

Off canvas provides a mechanism for positioning contextual sidebars outside of the viewport (on the left or right),
which can then be slid into view when activated. Supporting off canvas sidebars is relatively easy.

The only requirement is to create sidebars with either the `.off-canvas--left` or `.off-canvas--right`
modifier classes. These classes determine the side to position the sidebar on. The sidebars use `fixed`
positioning and can be placed anywhere in the source code, but we suggest placing them in the `body`.

```html
<aside class="off-canvas off-canvas--left" id="left-sidebar">
    ...
</aside>
```

Once we have our markup, the component can be initialized.

```javascript
$('.off-canvas').offCanvas();
```

<div class="notice is-info">
    The <code>.off-canvas</code> class is not required, but is useful when initializing multiple instances.
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

Supporting left and right sidebars is extremely easy. Simply duplicate the markup and JavaScript
for each side.

```html
<aside class="off-canvas off-canvas--left" id="left-sidebar">...</aside>
<aside class="off-canvas off-canvas--right" id="right-sidebar">...</aside>
```

```javascript
$('.off-canvas').offCanvas();
```

The component also supports multiple sidebars on the same side. However, when using this approach,
the `push` or `overlay` option must be used, as the move (squishing) pattern is not supported.

```html
<aside class="off-canvas off-canvas--left" id="primary-sidebar">...</aside>
<aside class="off-canvas off-canvas--left" id="secondary-sidebar">...</aside>
```

```javascript
$('.off-canvas').offCanvas({
    push: true
});
```

### Overlaying, Pushing, & Moving ###

There are 3 possible patterns for displaying a sidebar, the first which overlays the document,
the second which pushes the document outside the viewport, and the third which squishes the content
within the document to make room for the sidebar.

Overlaying, which is disabled by default, takes the highest precedence when enabled.
To enable overlaying, set `overlay` to true.

```javascript
$('.off-canvas').offCanvas({
    overlay: true
});
```

Pushing, which is enabled by default, will automatically set `hideOthers` to true, as 2 sidebars
cannot push the content at the same time.

```javascript
$('.off-canvas').offCanvas({
    push: true
});
```

When pushing is disabled, the fallback moving pattern will be used. This pattern will squish the
content (applies a padding on the body) to make room for the sidebar. To enable moving,
set `push` to false.

```javascript
$('.off-canvas').offCanvas({
    push: false
});
```

<div class="notice is-warning">
    When multiple off canvas sidebars are being used, they must all use the same push and overlay options.
    Using mis-configured instances will cause unexpected results.
</div>

### Custom Widths ###

By default, the sidebar is 20% width of the viewport. To use a fixed width, or to change the percentage,
a few CSS classes will need to be modified.

* First, set the width of the sidebar on the modifier.
* Then set a negative margin of the same amount. The negative side should equate to the location of the sidebar.
* Lastly, set the margin or padding of the same amount on the opposite `push-*` and `move-*` container class.

```css
// Left sidebar
.off-canvas--left { width: 200px; margin-left: -200px; }
.off-canvas-container.push-right { margin-left: 200px; }
.off-canvas-container.move-right { padding-left: 200px; }

// Right sidebar
.off-canvas--right { width: 15%; margin-right: -15%; }
.off-canvas-container.push-left { margin-left: -15%; } // Note the negative
.off-canvas-container.move-left { padding-right: 200px; }
```

<div class="notice is-info">
    Sass <code>$offCanvas-left-width</code> and <code>$offCanvas-right-width</code> variables
    can also be modified to alter these widths.
</div>

### Notes ###

* Do not use `conceal()` on the sidebar element as it breaks transitions.
* A `.canvas` class will be appended to the container.
* When a sidebar is open, the container will have a `.push-*` or `.move-*` class added (only if `overlay` is disabled).

## ARIA ##

The `complementary` role and the appropriate `aria-*` attributes are required when supporting ARIA.

```html
<aside class="off-canvas off-canvas--left" role="complementary">
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
            <td>$offCanvas-left-width</td>
            <td>20%</td>
            <td>The width of the left sidebar, and the amount of padding or margin to slide with.</td>
        </tr>
        <tr>
            <td>$offCanvas-right-width</td>
            <td>20%</td>
            <td>The width of the right sidebar, and the amount of padding or margin to slide with.</td>
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

Inherits all options from the [parent component](../development/js.md#options).

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
            <td>selector</td>
            <td>string</td>
            <td></td>
            <td>
                CSS selector to bind click toggle events to.
                This toggle event will open and close the sidebar.
            </td>
        </tr>
        <tr>
            <td>push</td>
            <td>bool</td>
            <td>true</td>
            <td>Will push the content outside of the viewport instead of squishing it.</td>
        </tr>
        <tr>
            <td>overlay</td>
            <td>bool</td>
            <td>false</td>
            <td>Will display the sidebar over the content, instead of pushing the content.</td>
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
            <td>hideOthers</td>
            <td>bool</td>
            <td>true</td>
            <td>Will hide all other sidebars when opening a sidebar.</td>
        </tr>
    </tbody>
</table>

## Events ##

Inherits all events from the [parent component](../development/js.md#events).

## Properties ##

Inherits all properties from the [parent component](../development/js.md#properties).

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
            <td>container</td>
            <td>element</td>
            <td>The parent element that contains the sidebar. Is usually the body.</td>
        </tr>
        <tr>
            <td>side</td>
            <td>string</td>
            <td>The side where the sidebar is positioned. Will either be left or right.</td>
        </tr>
        <tr>
            <td>opposite</td>
            <td>string</td>
            <td>
                The opposite of <code>side</code>.
                Is used for setting <code>push-*</code> and <code>move-*</code> classes on the container.
            </td>
        </tr>
    </tbody>
</table>

## Methods ##

Inherits all methods from the [parent component](../development/js.md#methods).

<table class="table is-striped data-table">
    <thead>
        <tr>
            <th>Method</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>toggle()</td>
            <td>
                Toggle the display of the sidebar.
                This method is triggered automatically through click events when <code>selector</code> is defined.
            </td>
        </tr>
    </tbody>
</table>
