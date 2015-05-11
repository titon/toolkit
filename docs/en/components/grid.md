# Grid #

Fluid grid with multiple column support. Supports different responsive sizes for columns.

## Usage ##

Toolkit is bundled with a robust, responsive, mobile first, fluid based, 12 column grid system that conveniently collapses and scales based on the device or viewport.

To begin, a grid consists of a `.grid` which wraps a collection of columns. Each column requires a `.col` and either a `.span-*` or one of the responsive column classes (more information below). There are 12 span classes which originate from the [base CSS](../development/css/base.md).

When placing columns, the number of columns should equal the max amount allowed in the grid. For example, the `.span-*` should equate to 12, where as responsive columns could have different caps.

```html
<!-- 12 columns -->
<div class="grid">
    <div class="col span-1">...</div>
    <div class="col span-1">...</div>
    <div class="col span-1">...</div>
    <div class="col span-1">...</div>
    <div class="col span-1">...</div>
    <div class="col span-1">...</div>
    <div class="col span-1">...</div>
    <div class="col span-1">...</div>
    <div class="col span-1">...</div>
    <div class="col span-1">...</div>
    <div class="col span-1">...</div>
    <div class="col span-1">...</div>
</div>

<!-- 3 columns of equal width -->
<div class="grid">
    <div class="col span-4">...</div>
    <div class="col span-4">...</div>
    <div class="col span-4">...</div>
</div>

<!-- 3 columns with sidebars -->
<div class="grid">
    <div class="col span-2">...</div>
    <div class="col span-8">...</div>
    <div class="col span-2">...</div>
</div>

<!-- 2 columns -->
<div class="grid">
    <div class="col span-3">...</div>
    <div class="col span-9">...</div>
</div>
```

<div class="notice is-info">
    A <code>.span-*</code> provides consistent widths for all devices and viewports, and never collapses because of breakpoints.
</div>

<div class="notice is-info">
    All grid rows are 100% width unless manually capped with <code>max-width</code>.
</div>

### Push & Pull ###

Move columns to the left or to the right by using `.push-*` and `.pull-*` classes. Pushing a column will increase the `left` offset, while pulling will increase the `right` offset. Each push or pull increment is equal to a single column.

```html
<div class="grid">
    <div class="col span-6 push-3">
        I'm centered!
    </div>
</div>
```

Pushing and pulling can also be used to reverse the column order.

```html
<div class="grid">
    <div class="col span-8 push-4">I'm on the right side now.</div>
    <div class="col span-4 pull-8">And I'm on the left side.</div>
</div>
```

<div class="notice is-info">
    Responsive columns will have their own push and pull classes. Continue reading for more information on these.
</div>

### Nesting Grids ###

Grids can be nested within each other, with each having their own set of columns. Be sure that all columns add up to the max amount of columns.

```html
<div class="grid">
    <div class="col span-8">
        <div class="grid">
            <div class="col span-6">...</span>
            <div class="col span-6">...</span>
        </div>
    </div>

    <div class="col span-4">
        ...
    </div>
</div>
```

### Responsive Columns ###

On top of providing `.span-*` columns that work the same on all viewports, Toolkit comes bundled with a responsive based grid. Responsive grids are designed in such a way that certain columns only activate within specific breakpoints. If the viewport is outside of that breakpoint, columns will collapse to their standard block display at 100% width, which is perfect for small mobile devices.

```html
<div class="grid">
    <div class="col medium-6 large-4">
        Collapses to 100% width on small devices.
        Is 50% width on medium devices, and 33.3% on large devices and above.
    </div>

    <div class="col medium-6 large-8">
        Also collapses to 100% on small devices.
        Medium width is still 50%, but large width is 66.6%.
    </div>
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
            <td>Push Class</td>
            <td>.xsmall-push-*</td>
            <td>.small-push-*</td>
            <td>.medium-push-*</td>
            <td>.large-push-*</td>
        </tr>
        <tr>
            <td>Pull Class</td>
            <td>.xsmall-pull-*</td>
            <td>.small-pull-*</td>
            <td>.medium-pull-*</td>
            <td>.large-pull-*</td>
        </tr>
        <tr>
            <td>Column Count</td>
            <td>6</td>
            <td>12</td>
            <td>12</td>
            <td>12</td>
        </tr>
        <tr>
            <td>Column Width</td>
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

### Custom Sizes ###

Want to customize the grid sizes and their breakpoints? Well it couldn't be easier. Simply set the `$grid-sizes` map with your new settings. Each key in the map is the name of the size, and the value is a list with the column count and the breakpoint range list.

Let's recreate the common mobile, tablet, and desktop sizes.

```scss
$grid-sizes: (
    mobile: (6, (null, 640px)),
    tablet: (12, (641px, 1024px)),
    desktop: (12, (1025px, null))
);
```

Alternatively, you could modify the `$breakpoint-range-*` variables to alter the breakpoints as the Grid inherits these values.

<div class="notice is-info">
    Null values can be used in the breakpoint range to create an open ended range in either direction. This should only be used on the first and last items in the map.
</div>

### End Capping ###

To float a column to the right and collapse its margin, add `.end` to the column.

```html
<div class="col span-6 end">...</div>
```

### Extending Styles ###

Instead of placing `.grid` and `.col` classes all over the source code, we can extend them with Sass. This requires either the Compass extension to be installed, or the Toolkit CSS in the lookup path.

```scss
.wrapper {
    @include grid-row();
}

.content {
    @include grid-column();
    @extend .span-9;
}

.sidebar {
    @include grid-column();
    @extend .span-3;
}
```

```html
<div class="wrapper">
    <div class="content">...</div>
    <aside class="sidebar">...</aside>
</div>
```

Or we can [customize our own grids](../development/sass/usage.md#grid-building).

### Notes ###

* Columns must be wrapped with `.grid` unless created with `grid-row()`.
* Columns require a `.col` class.
* Only columns should be immediate children of grid wrappers.
* Adding a `max-width` to a grid wrapper will restrict its size.
* A gutter (spacing between columns) can be defined through `$grid-gutter`.
* Push and pull classes can be toggled through `$grid-push-pull`.

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
            <td>$grid-class</td>
            <td>.grid</td>
            <td>CSS class name for the grid row.</td>
        </tr>
        <tr>
            <td>$grid-class-column</td>
            <td>.col</td>
            <td>CSS class name for the grid column.</td>
        </tr>
        <tr>
            <td>$grid-class-end</td>
            <td>.end</td>
            <td>CSS class name for the end cap.</td>
        </tr>
        <tr>
            <td>$grid-columns-xlarge</td>
            <td>18</td>
            <td rowspan="5">The number of columns available per responsive breakpoint.</td>
        </tr>
        <tr>
            <td>$grid-columns-large</td>
            <td>12</td>
        </tr>
        <tr>
            <td>$grid-columns-medium</td>
            <td>12</td>
        </tr>
        <tr>
            <td>$grid-columns-small</td>
            <td>12</td>
        </tr>
        <tr>
            <td>$grid-columns-xsmall</td>
            <td>6</td>
        </tr>
        <tr>
            <td>$grid-gutter</td>
            <td>false</td>
            <td>The spacing between each column. Can accept any unit type: px, em, rem, %, or false if no gutter is desired.</td>
        </tr>
        <tr>
            <td>$grid-push-pull</td>
            <td>true</td>
            <td>Includes push and pull classes within the output. Disable to reduce filesize if we aren't using them.</td>
        </tr>
        <tr>
            <td>$grid-sizes</td>
            <td>(xsmall: (...), small: (...), medium: (...), large: (...))</td>
            <td>
                A mapping of grid sizes to column counts and breakpoints ranges.
                Each size accepts a list with the 1st item being a column count, and the 2nd item being a list of min and max ranges.
                View the docs above for more on altering this variable.
            </td>
        </tr>
        <tr>
            <td>$grid-width</td>
            <td>100%</td>
            <td>The width of the grid. The wrapper and columns are fluid by default so percentages are suggested.</td>
        </tr>
    </tbody>
</table>
