# Flex #

Layouts based on the flexbox specification. Supports different responsive sizes for blocks.

<div class="notice is-error">
    This component is not available in the distribution files and must be manually enabled in the Sass layer by removing "flex" from the <code>$modules-excluded</code> Sass variable.x         
</div>

## Usage ##

While a grid is represented by rows and columns, flex is represented by regions and blocks. A region is an object that contains blocks, or other regions, and enables flexbox functionality. A region is analogous to rows in a grid. A block however, is an object that contains content and is positioned either horizontally, vertically, or in a grid, depending on the state of the parent region. A block is analogous to columns in a grid but with much more flexibility (get it?).

A region is declared using the `.region` class while a block is declared using the `.block` class. The `.span-*` classes can be used for setting widths via fixed percentages. There are 12 span classes which originate from the [base CSS](../development/css/base.md).

```html
<div class="region">
    <aside class="block span-3">...</aside>
    <section class="block span-9">...</aside>
</div>
```

<div class="notice is-warning">
    This component is experimental and will not work in all browsers. The current defined functionality and classes may also change in future versions.
</div>

### Alignment ###

By default, a region will align blocks at the start of the container, usually the top left. To modify the alignment, a handful of `.flow-*` classes can be added to the region. These flow classes make use of `justify-content` internally.

* `.flow-top`, `.flow-left` - Align blocks at the start of the region
* `.flow-bottom`, `.flow-right` - Align blocks at the end of the region
* `.flow-center` - Align blocks at the center horizontally or vertically
* `.flow-between` - Align blocks so that space is evenly distribute between blocks
* `.flow-around` - Align blocks so that space is evenly distributed on the edges and between blocks

```html
<div class="region flow-center">
    <div class="block span-6">
        I am centered!
    </div>
</div>
```

#### Block Overrides ####

A blocks alignment is based on the settings of the parent region (mentioned previously), but what if we want to align on a block-by-block basis? This can be achieved using the blocks `.self-*` alignment classes. These classes make use of `align-self` internally.

Now why would we override an individual block? Say we have a row of 5 blocks of variable height, with each block aligned vertically at the top, and we want to align the middle block vertically at the bottom. This is what self alignment solves.

* `.self-top`, `.self-left` - Align blocks at the start of the cross-axis
* `.self-bottom`, `.self-right` - Align blocks at the end of the cross-axis
* `.self-center` - Align blocks at the center of the cross-axis
* `.self-baseline` - Align blocks at the baseline of the text line height
* `.self-stretch` - Stretch a block to fill the entire cross-axis while maintaining width and height constraints

```html
<div class="region flow-between">
    <div class="block">...</div>
    <div class="block">...</div>
    <div class="block self-bottom">...</div>
    <div class="block">...</div>
    <div class="block">...</div>
</div>
```

<div class="notice is-info">
    Both region and block alignments take into account the main-axis and the cross-axis.
</div>

### Shrinking & Growing ###

A block by default will grow but not shrink -- this is equivalent to `flex: 1 0 auto`. This default setting allows for blocks to automatically scale and work correctly in most use cases. However, this can be overridden using the grow and shrink classes.

* `.grow` - Will set the block to grow using factor 1 (default).
* `.no-grow` - Will not grow the block.
* `.shrink` - Will set the block to shrink using factor 1.
* `.no-shrink` - Will not shrink the block (default).

```html
<div class="region">
    <div class="block">...</div>
    <div class="block no-grow">...</div>
    <div class="block">...</div>
</div>
```

To set the grow or shrink factor higher than 1 will require custom CSS.

```css
.grow-large { flex-grow: 3 }
```
```html
<div class="region">
    <div class="block grow-large">...</div>
    <div class="block no-grow">...</div>
    <div class="block">...</div>
</div>
```

### Ordering ###

The initial order of a block is set to 100. Why 100? Because it allows custom orders to be used without any chance of collision. Ordering can either be set using the `.order-*` classes or through custom CSS.

```html
<div class="region">
    <div class="block order-2">...</div>
    <div class="block order-3">...</div>
    <div class="block order-1">...</div>
</div>
```

<div class="notice is-info">
    There are 6 order classes available, which can be increased using the <code>$flex-order-count</code> variable.
</div>

### Wrapping ###

A block within a row (or column) will *not* wrap to the next line and instead will continue to squeeze (grow or shrink) to make room for other blocks. To allow wrapping of blocks, the `.region--wrap` modifier can be used.

```html
<div class="region region--wrap">
    <div class="block">...</div>
    <div class="block">...</div>
    <div class="block">...</div>
    <div class="block">...</div>
    <div class="block">...</div>
</div>
```

A custom width must also be applied to each block or else the wrapping will not occur as their scaling is automatic. Let's apply a base width of 33.3% which will allow for 3 blocks per row.

```css
.region--wrap .block { flex-basis: 33.3%; }
```

<div class="notice is-warning">
    If there are not enough blocks to fill a row, like the 2 blocks on the last line in our previous example, the blocks will continue to grow to fill the entire row width. This may break any alignment but there is no solution to this problem.
</div>

### Nesting ###

Regions can be nested within each other, with each having their own set of blocks.

```html
<div class="region">
    <aside class="block span-3">
        <div class="region region--vertical">
            <div class="block">...</div>
            <div class="block">...</div>
        </div>
    </aside>
    <section class="block span-9">...</aside>
</div>
```

### Horizontal & Vertical ###

Blocks and rendered across the main-axis, which is horizontally, as we read from left to right, instead of top to bottom. However, we can set the main-axis to be vertical, which in turn will render the blocks from top to bottom. We can use either the `.region--horizontal` (default) or `.region--vertical` class to achieve this. These classes make use of `flex-direction` internally.

```html
<div class="region region--vertical">
    <div class="block">...</div>
    <div class="block">...</div>
    <div class="block">...</div>
</div>
```

### Grids ###

A grid will render blocks so that a gutter is evenly distributed between, heights stay consistent between rows, and edges are flush against their container. A grid can be enabled using `.region--grid` and setting a base width on the blocks.

```html
<div class="region region--grid">
    <div class="block">...</div>
    <div class="block">...</div>
    <div class="block">...</div>
    <div class="block">...</div>
    <div class="block">...</div>

    <div class="block">...</div>
    <div class="block">...</div>
</div>
```

Let's apply a base width of 20% which will allow for 5 blocks per row.

```css
.region--grid .block { flex-basis: 20%; }
```

<div class="notice is-warning">
    If there are not enough blocks to fill a row, like the 2 blocks on the last line in our previous example, the blocks will continue to grow to fill the entire row width. This may break any alignment but there is no solution to this problem.
</div>

### Responsive Blocks ###

On top of providing `.span-*` blocks that work the same on all viewports, Toolkit comes bundled with responsiveness built in. Responsive is designed in such a way that certain blocks only activate within specific breakpoints. This functionality is very similar to the [grids responsive system](grid.md#responsive-columns).

```html
<div class="region">
    <aside class="block medium-6 large-4">
        Collapses to base width on small devices.
        Is 50% width on medium devices, and 33.3% on large devices and above.
    </aside>
    
    <section class="block medium-6 large-8">
        Also collapses to base width on small devices.
        Medium width is still 50%, but large width is 66.6%.
    </aside>
</div>
```

#### Size Chart ####

Extra small is designed for mobile devices with low resolution screens. Small is designed for mobile devices in portrait mode. Medium is designed for mobile devices in landscape mode, tablets in portrait mode, and small screened desktops and laptops. Large is designed for mobile/tablets in landscape mode and wide screen desktops, laptops, and displays.

<table class="table is-striped data-table">
    <thead>
        <tr>
            <th> </th>
            <th>Extra Small</th>
            <th>Small</th>
            <th>Medium</th>
            <th>Large</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Breakpoint</td>
            <td>0-640px</td>
            <td>641px-960px</td>
            <td>961px-1280px</td>
            <td>1280px+</td>
        </tr>
        <tr>
            <td>Base Class</td>
            <td>.xsmall-*</td>
            <td>.small-*</td>
            <td>.medium-*</td>
            <td>.large-*</td>
        </tr>
        <tr>
            <td>Block Count</td>
            <td>6</td>
            <td>12</td>
            <td>12</td>
            <td>12</td>
        </tr>
        <tr>
            <td>Block Width</td>
            <td>16.6%</td>
            <td>8.3%</td>
            <td>8.3%</td>
            <td>8.3%</td>
        </tr>
        <tr>
            <td>Devices</td>
            <td>iPhone 4/5 (P)</td>
            <td>iPhone 4 (L), iPad 2 (P), Galaxy S3 (P), Moto X (P)</td>
            <td>iPhone 5 (L), iPad 2 (L), Nexus 5 (P), Galaxy S3 (L), Galaxy Note (P), HTC One (P), Moto X (L)</td>
            <td>Laptops, Desktops, iPad 3/4 (P, L), Nexus 5 (L), Galaxy Note (L), HTC One (L)</td>
        </tr>
    </tbody>
</table>

<div class="notice is-info">
    The (P) and (L) in the chart above stand for portrait and landscape respectively.
</div>

#### Ordering ####

The ordering of blocks can also be responsive through the use of responsive order classes. These classes make use of the sizes and and block counts mentioned previously.

```html
<div class="region">
    <div class="block small-order-2 large-order-1">...</div>
    <div class="block small-order-3 large-order-3">...</div>
    <div class="block small-order-1 large-order-2">...</div>
</div>
```

#### Mobile Row Collapsing ####

The difference between flex and grid is that flex does *not* automatically stack blocks as columns in mobile devices. This will require manual intervention and can be achieved using `flex-direction`.

```scss
// Stack blocks vertically for devices with less than 640px resolution
@media only screen and (max-width: 640px) {
    .region { flex-direction: column; }
}
```

### Notes ###

* Blocks must be wrapped with `.region` unless created with `flex-region()`.
* Only blocks should be immediate children of regions.
* Adding a `max-width` to a region will restrict its size.
* A gutter (spacing between blocks) can be defined through `$flex-gutter`.
* Ordering classes can be modified through `$flex-order-count`.

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
            <td>$flex-class-region</td>
            <td>.region</td>
            <td>CSS class name for the flex region.</td>
        </tr>
        <tr>
            <td>$flex-class-modifier-grid</td>
            <td>.region--grid</td>
            <td>CSS class name for the region grid modifier.</td>
        </tr>
        <tr>
            <td>$flex-class-modifier-wrap</td>
            <td>.region--wrap</td>
            <td>CSS class name for the region wrap modifier.</td>
        </tr>
        <tr>
            <td>$flex-class-modifier-horizontal</td>
            <td>.region--horizontal</td>
            <td>CSS class name for the region horizontal modifier.</td>
        </tr>
        <tr>
            <td>$flex-class-modifier-vertical</td>
            <td>.region--vertical</td>
            <td>CSS class name for the region vertical modifier.</td>
        </tr>
        <tr>
            <td>$flex-class-block</td>
            <td>.block</td>
            <td>CSS class name for the flex block.</td>
        </tr>
        <tr>
            <td>$flex-blocks-xlarge</td>
            <td>18</td>
            <td rowspan="5">The number of blocks available per responsive breakpoint.</td>
        </tr>
        <tr>
            <td>$flex-blocks-large</td>
            <td>12</td>
        </tr>
        <tr>
            <td>$flex-blocks-medium</td>
            <td>12</td>
        </tr>
        <tr>
            <td>$flex-blocks-small</td>
            <td>12</td>
        </tr>
        <tr>
            <td>$flex-blocks-xsmall</td>
            <td>6</td>
        </tr>
        <tr>
            <td>$flex-gutter</td>
            <td>false</td>
            <td>The spacing between each block. Can accept any unit type: px, em, rem, %, or false if no gutter is desired.</td>
        </tr>
        <tr>
            <td>$flex-grid-gutter</td>
            <td>1rem</td>
            <td>The spacing between each block when the grid modifier is used.</td>
        </tr>
        <tr>
            <td>$flex-modifiers</td>
            <td>("horizontal", "vertical", "wrap", "grid")</td>
            <td>List of modifiers to include in the CSS output. Accepts horizontal, vertical, wrap, and grid.</td>
        </tr>
        <tr>
            <td>$flex-order-count</td>
            <td>6</td>
            <td>The number of order classes to generate for each responsive size..</td>
        </tr>
        <tr>
            <td>$flex-sizes</td>
            <td>(xsmall: (...), small: (...), medium: (...), large: (...))</td>
            <td>
                A mapping of flex sizes to block counts and breakpoints ranges.
                Each size accepts a list with the 1st item being a block count, and the 2nd item being a list of min and max ranges.
                View the docs above for more on altering this variable.
            </td>
        </tr>
        <tr>
            <td>$flex-width</td>
            <td>100%</td>
            <td>The max width of the region. The region and blocks are fluid by default so percentages are suggested.</td>
        </tr>
    </tbody>
</table>
