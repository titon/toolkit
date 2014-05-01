# Grid #

Fluid grid with multiple column support. Supports different columns for responsive sizes.

## Usage ##

Toolkit is bundled with a robust, responsive, mobile first, fluid based, 12 column grid system that
conveniently collapses and scales based on the device or viewport.

To begin, a grid consists of a `.grid` which wraps a collection of columns.
Each column requires a `.col` and either a `.span-*` or one of the responsive column classes
(more information below). There are 12 span classes, with each number representing the number
of columns it contains.

When placing columns, the number of columns should equal the max amount allowed in the grid.
For example, the `.span-*` should equate to 12, where as responsive columns have different caps.

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
    A <code>.span-*</code> column provides consistent widths
    for all devices and viewports, and never collapses because of breakpoints.
</div>

<div class="notice is-info">
    All grids are 100% width unless capped manually with <code>max-width</code>.
</div>

### Push & Pull ###

Move columns to the left or to the right by using `.push-*` and `.pull-*` classes.
Pushing a column will increase the `left` offset, while pulling will increase the `right` offset.
Each push or pull increment is equal to a single column.

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
    Responsive columns will have their own push and pull classes.
    Continue reading for more information on these.
</div>

### Nesting Grids ###

Grids can be nested within each other, with each having their own set of columns.
Be sure that all columns add up to the max amount of columns.

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

On top of providing `.span-*` columns that work the same on all viewports,
Toolkit comes bundled with 2 responsive based systems. Both systems are enabled by default,
but can be toggled through the `$responsive-size` variable, in an effort to reduce filesize.

Responsive grids are designed in such a way that certain columns only activate within
certain breakpoints. If the viewport is outside of that breakpoint, columns will collapse
to their standard block display at 100% width, which is perfect for small mobile devices.
Take the following for example, which is using the `device` based responsive system.

```html
<div class="grid">
    <div class="col tablet-3 desktop-4">
        Collapses to 100% width on mobile devices.
        Is 50% width on tablets, and 33.3% on desktop and above.
    </div>

    <div class="col tablet-3 desktop-8">
        Also collapses to 100% on mobile devices.
        Tablet width is still 50%, but desktop width is 66.6%.
    </div>
</div>
```

#### Size Based ####

The following classes are available when `$responsive-size` is set to `size` or `both`.
Small is designed for all mobile devices and tablets in portrait mode.
Medium is designed for tablets in landscape mode, and small screened desktops and laptops.
Large is designed for wide screen desktops and displays.

<table class="table is-striped data-table">
    <thead>
        <tr>
            <th> </th>
            <th>Small</th>
            <th>Medium</th>
            <th>Large</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Base Class</td>
            <td>.small-*</td>
            <td>.medium-*</td>
            <td>.large-*</td>
        </tr>
        <tr>
            <td>Push Class</td>
            <td>.small-push-*</td>
            <td>.medium-push-*</td>
            <td>.large-push-*</td>
        </tr>
        <tr>
            <td>Pull Class</td>
            <td>.small-pull-*</td>
            <td>.medium-pull-*</td>
            <td>.large-pull-*</td>
        </tr>
        <tr>
            <td>Column Count</td>
            <td>6</td>
            <td>12</td>
            <td>12</td>
        </tr>
        <tr>
            <td>Column Width</td>
            <td>16.6%</td>
            <td>8.3%</td>
            <td>8.3%</td>
        </tr>
        <tr>
            <td>Breakpoints</td>
            <td>0-768px</td>
            <td>769px-1280px</td>
            <td>1281px+</td>
        </tr>
    </tbody>
</table>

#### Device Based ####

The following classes are available when `$responsive-size` is set to `device` or `both`.
Mobile is designed for mobile devices in landscape and portrait.
Tablet is designed for tablet devices in landscape and portrait.
Desktop is designed for all devices larger than tablet in landscape.

<table class="table is-striped data-table">
    <thead>
        <tr>
            <th> </th>
            <th>Mobile</th>
            <th>Tablet</th>
            <th>Desktop</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Base Class</td>
            <td>.mobile-*</td>
            <td>.tablet-*</td>
            <td>.desktop-*</td>
        </tr>
        <tr>
            <td>Push Class</td>
            <td>.mobile-push-*</td>
            <td>.tablet-push-*</td>
            <td>.desktop-push-*</td>
        </tr>
        <tr>
            <td>Pull Class</td>
            <td>.mobile-pull-*</td>
            <td>.tablet-pull-*</td>
            <td>.desktop-pull-*</td>
        </tr>
        <tr>
            <td>Column Count</td>
            <td>3</td>
            <td>6</td>
            <td>12</td>
        </tr>
        <tr>
            <td>Column Width</td>
            <td>33.3%</td>
            <td>16.6%</td>
            <td>8.3%</td>
        </tr>
        <tr>
            <td>Breakpoints</td>
            <td>0-480px</td>
            <td>481px-1024px</td>
            <td>1025px+</td>
        </tr>
    </tbody>
</table>

### End Capping ###

To float a column to the right and collapse its margin, add `.end` to the column.

```html
<div class="col span-6 end">...</div>
```

### Extending Styles ###

Instead of placing `.grid` and `.col` classes all over the source code, we can extend them with Sass.
This requires either the Compass extension to be installed, or the Toolkit CSS in the lookup path.

```scss
.wrapper {
    @extend %row;
}

.content {
    @extend %col;
    @extend .span-9;
}

.sidebar {
    @extend %col;
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
            <td>$grid-width</td>
            <td>100%</td>
            <td>The width of the grid. The wrapper and columns are fluid by default so percentages are suggested.</td>
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
            <td>$grid-columns-desktop</td>
            <td>12</td>
            <td rowspan="3">The number of columns available per device when <code>$responsive-size</code> is <code>device</code>.</td>
        </tr>
        <tr>
            <td>$grid-columns-tablet</td>
            <td>6</td>
        </tr>
        <tr>
            <td>$grid-columns-mobile</td>
            <td>3</td>
        </tr>
        <tr>
            <td>$grid-columns-large</td>
            <td>12</td>
            <td rowspan="3">The number of columns available per size when <code>$responsive-size</code> is <code>size</code>.</td>
        </tr>
        <tr>
            <td>$grid-columns-medium</td>
            <td>12</td>
        </tr>
        <tr>
            <td>$grid-columns-small</td>
            <td>6</td>
        </tr>
    </tbody>
</table>
