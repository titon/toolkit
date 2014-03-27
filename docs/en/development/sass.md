# Sass #

* [Variables](#variables)
* [Mixins](#mixins)
* [Functions](#functions)
* [Unit Conversion](#unit-conversion)
* [Media Queries & Responsiveness](#media-queries--responsiveness)
* [Grid Building](#grid-building)

## Variables ##

Toolkit provides many variables for adjusting and modifying functionality within the Sass layer &mdash;
it *does not* provide variables for property styling. This can and should be achieved by writing Sass (or CSS) after installing Toolkit.

<table class="table is-striped data-table">
    <thead>
        <tr>
            <th>Variable</th>
            <th>Default Value</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>$vendor-prefix</td>
            <td></td>
            <td>Will prefix all top level class names with a vendor or namespace.</td>
        </tr>
        <tr>
            <td>$size-small-class</td>
            <td>small</td>
            <td rowspan="3">Names for global sizing classes.</td>
        </tr>
        <tr>
            <td>$size-medium-class</td>
            <td>medium</td>
        </tr>
        <tr>
            <td>$size-large-class</td>
            <td>large</td>
        </tr>
        <tr>
            <td>$shape-square-class</td>
            <td>square</td>
            <td rowspan="5">Names for global shape classes.</td>
        </tr>
        <tr>
            <td>$shape-round-class</td>
            <td>round</td>
        </tr>
        <tr>
            <td>$shape-oval-class</td>
            <td>oval</td>
        </tr>
        <tr>
            <td>$shape-pill-class</td>
            <td>pill</td>
        </tr>
        <tr>
            <td>$shape-skew-class</td>
            <td>skew</td>
        </tr>

        <tr class="table-divider">
            <td colspan="3">Sizing & Spacing</td>
        </tr>
        <tr>
            <td>$base-size</td>
            <td>14px</td>
            <td>Base document font size. This value is used for grid and responsive calculations.</td>
        </tr>
        <tr>
            <td>$base-line-height</td>
            <td>1.25em</td>
            <td>Base document line height.</td>
        </tr>
        <tr>
            <td>$h1-size</td>
            <td>3rem</td>
            <td rowspan="6">Heading font sizes. Uses rem scaling by default to scale based on the html font size.</td>
        </tr>
        <tr>
            <td>$h2-size</td>
            <td>2.5rem</td>
        </tr>
        <tr>
            <td>$h3-size</td>
            <td>2.1rem</td>
        </tr>
        <tr>
            <td>$h4-size</td>
            <td>1.8rem</td>
        </tr>
        <tr>
            <td>$h5-size</td>
            <td>1.5rem</td>
        </tr>
        <tr>
            <td>$h6-size</td>
            <td>1.2rem</td>
        </tr>
        <tr>
            <td>$small-size</td>
            <td>.7rem</td>
            <td>Font size for elements with the <code>.small</code> class.</td>
        </tr>
        <tr>
            <td>$medium-size</td>
            <td>1rem</td>
            <td>The default font size for elements.</td>
        </tr>
        <tr>
            <td>$large-size</td>
            <td>1.3rem</td>
            <td>Font size for elements with the <code>.large</code> class.</td>
        </tr>
        <tr>
            <td>$small-padding</td>
            <td>.5rem</td>
            <td>Padding for elements with the <code>.small</code> class.</td>
        </tr>
        <tr>
            <td>$medium-padding</td>
            <td>.75rem</td>
            <td>The default padding for elements.</td>
        </tr>
        <tr>
            <td>$large-padding</td>
            <td>1rem</td>
            <td>Padding for elements with the <code>.large</code> class.</td>
        </tr>

        <tr class="table-divider">
            <td colspan="3">Border Styles</td>
        </tr>
        <tr>
            <td>$round</td>
            <td>.2rem</td>
            <td>Softly rounded corners.</td>
        </tr>
        <tr>
            <td>$pill</td>
            <td>2rem</td>
            <td>Pill shaped corners.</td>
        </tr>
        <tr>
            <td>$oval-x</td>
            <td>7rem</td>
            <td rowspan="2">Oval shaped corners.</td>
        </tr>
        <tr>
            <td>$oval-y</td>
            <td>2.75rem</td>
        </tr>
        <tr>
            <td>$skew-x</td>
            <td>1rem</td>
            <td rowspan="2">Manilla tab shaped corners.</td>
        </tr>
        <tr>
            <td>$skew-y</td>
            <td>3rem</td>
        </tr>

        <tr class="table-divider">
            <td colspan="3">States</td>
        </tr>
        <tr>
            <td>$gray</td>
            <td>#f5f5f5</td>
            <td rowspan="5">Background and border colors in specific elements. Prominently used in tables and forms.</td>
        </tr>
        <tr>
            <td>$gray-light</td>
            <td>#f8f8f8</td>
        </tr>
        <tr>
            <td>$gray-lightest</td>
            <td>#fbfbfb</td>
        </tr>
        <tr>
            <td>$gray-dark</td>
            <td>#e5e5e5</td>
        </tr>
        <tr>
            <td>$gray-darkest</td>
            <td>#c2c2c2</td>
        </tr>
        <tr>
            <td>$default</td>
            <td>#929497</td>
            <td rowspan="3">Colors used for the default state of elements. A gray color by default.</td>
        </tr>
        <tr>
            <td>$default-light</td>
            <td>#d0d2d3</td>
        </tr>
        <tr>
            <td>$default-dark</td>
            <td>#404041</td>
        </tr>
        <tr>
            <td>$info</td>
            <td>#45c5eb</td>
            <td rowspan="3">Colors used on elements with the <code>.is-info</code> class. Usually a blue color representing an informational state.</td>
        </tr>
        <tr>
            <td>$info-light</td>
            <td>#dbf1fa</td>
        </tr>
        <tr>
            <td>$info-dark</td>
            <td>#4067ab</td>
        </tr>
        <tr>
            <td>$success</td>
            <td>#97cb6f</td>
            <td rowspan="3">Colors used on elements with the <code>.is-success</code> class. Usually a green color representing a success state.</td>
        </tr>
        <tr>
            <td>$success-light</td>
            <td>#e7f2dd</td>
        </tr>
        <tr>
            <td>$success-dark</td>
            <td>#226b36</td>
        </tr>
        <tr>
            <td>$warning</td>
            <td>#fcd04b</td>
            <td rowspan="3">Colors used on elements with the <code>.is-warning</code> class. Usually a yellow or orange color representing a warning state.</td>
        </tr>
        <tr>
            <td>$warning-light</td>
            <td>#ffebb5</td>
        </tr>
        <tr>
            <td>$warning-dark</td>
            <td>#c87e00</td>
        </tr>
        <tr>
            <td>$error</td>
            <td>#f06060</td>
            <td rowspan="3">Colors used on elements with the <code>.is-error</code> class. Usually a red color representing an error or danger state.</td>
        </tr>
        <tr>
            <td>$error-light</td>
            <td>#fdc5c1</td>
        </tr>
        <tr>
            <td>$error-dark</td>
            <td>#b10e0e</td>
        </tr>

        <tr class="table-divider">
            <td colspan="3">Responsive</td>
        </tr>
        <tr>
            <td>$responsive-design</td>
            <td>mobile</td>
            <td>
                Determines which type of device to target; accepts <code>mobile</code> or <code>desktop</code>.
                If <code>mobile</code> is used, responsive mixins will use <code>min-width</code> breakpoints in media queries.
                If <code>desktop</code> is used, then <code>max-width</code> breakpoints are used.
            </td>
        </tr>
        <tr>
            <td>$responsive-size</td>
            <td>both</td>
            <td>
                Determines which responsive columns are generated within the Grid component; accepts <code>device</code>, <code>size</code>, or <code>both</code>.
                If <code>device</code> is used, than mobile, tablet, and desktop classes are available for the <code>.col</code> class.
                If <code>size</code> is used, than small, medium, and large classes are available. If <code>both</code> is used, then all classes are available.
                The breakpoint variables below are used to determine the media query breakpoints per column class.
            </td>
        </tr>
        <tr>
            <td>$breakpoint-desktop</td>
            <td>1440px</td>
            <td rowspan="6">
                Breakpoints used when <code>$responsive-size</code> is <code>device</code>.
                Also used as <code>min/max-width</code> in responsive mixins.
            </td>
        </tr>
        <tr>
            <td>$breakpoint-laptop</td>
            <td>1280px</td>
        </tr>
        <tr>
            <td>$breakpoint-tablet-landscape</td>
            <td>1024px</td>
        </tr>
        <tr>
            <td>$breakpoint-tablet-portrait</td>
            <td>768px</td>
        </tr>
        <tr>
            <td>$breakpoint-mobile-landscape</td>
            <td>480px</td>
        </tr>
        <tr>
            <td>$breakpoint-mobile-portrait</td>
            <td>320px</td>
        </tr>
        <tr>
            <td>$breakpoint-large</td>
            <td>1440px</td>
            <td rowspan="3">
                Breakpoints used when <code>$responsive-size</code> is <code>size</code>.
                Also used as <code>min/max-width</code> in responsive mixins.
            </td>
        </tr>
        <tr>
            <td>$breakpoint-medium</td>
            <td>1280px</td>
        </tr>
        <tr>
            <td>$breakpoint-small</td>
            <td>768px</td>
        </tr>
    </tbody>
</table>

## Mixins ##

Mixins are a powerful Sass feature that allow for modularity and re-use of code. Toolkit comes bundle with a handful of mixins
that solve everyday problems like grid building, style resets, and media query management.

<table class="table is-striped data-table">
    <thead>
        <tr>
            <th>Mixin</th>
            <th>Nestable</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>clear-fix()</td>
            <td></td>
            <td>Provides <code>:after</code> styles on the parent for clearing child floats.</td>
        </tr>
        <tr>
            <td>reset-inline-block()</td>
            <td></td>
            <td>Resets the styles of an element to inline-block, aligns vertically in the middle, and resets margin, padding, etc.</td>
        </tr>
        <tr>
            <td>reset-list()</td>
            <td></td>
            <td>Resets the styles of a list element by removing margin, padding, and list style.</td>
        </tr>
        <tr>
            <td>position-center()</td>
            <td></td>
            <td>Absolutely positions an element in the center of the container. Makes use of the transform translate CSS property.</td>
        </tr>
        <tr>
            <td>size-small()</td>
            <td></td>
            <td rowspan="3">Defines the font size and padding for the respective size. Uses the sizing variables as values.</td>
        </tr>
        <tr>
            <td>size-medium()</td>
            <td></td>
        </tr>
        <tr>
            <td>size-large()</td>
            <td></td>
        </tr>
        <tr>
            <td>is-small($self, $parent)</td>
            <td>Yes</td>
            <td rowspan="3">
                Programmatically sets size classes on either the current element, or the parent element, or both, depending on arguments.
            </td>
        </tr>
        <tr>
            <td>is-medium($self, $parent)</td>
            <td>Yes</td>
        </tr>
        <tr>
            <td>is-large($self, $parent)</td>
            <td>Yes</td>
        </tr>

        <tr class="table-divider">
            <td colspan="3">States</td>
        </tr>
        <tr>
            <td>is-active()</td>
            <td>Yes</td>
            <td>Defines styles for the active class on the current element, and for being a child of an active parent.</td>
        </tr>
        <tr>
            <td>is-disabled()</td>
            <td>Yes</td>
            <td>Defines styles for the disabled class on the current element, and for being a child of a disabled parent.</td>
        </tr>
        <tr>
            <td>is-info()</td>
            <td>Yes</td>
            <td rowspan="4">Defines styles for the respective state class on the current element.</td>
        </tr>
        <tr>
            <td>is-error()</td>
            <td>Yes</td>
        </tr>
        <tr>
            <td>is-warning()</td>
            <td>Yes</td>
        </tr>
        <tr>
            <td>is-success()</td>
            <td>Yes</td>
        </tr>

        <tr class="table-divider">
            <td colspan="3">Responsive</td>
        </tr>
        <tr>
            <td>if-min($min)</td>
            <td>Yes</td>
            <td rowspan="3">
                Generates media queries using <code>min-width</code> and or <code>max-width</code> features.
            </td>
        </tr>
        <tr>
            <td>if-max($max)</td>
            <td>Yes</td>
        </tr>
        <tr>
            <td>if-min-max($min, $max)</td>
            <td>Yes</td>
        </tr>
        <tr>
            <td>if-landscape()</td>
            <td>Yes</td>
            <td rowspan="2">Generates media queries for device orientation.</td>
        </tr>
        <tr>
            <td>if-portrait()</td>
            <td>Yes</td>
        </tr>
        <tr>
            <td>if-retina()</td>
            <td>Yes</td>
            <td>Generates media queries for high resolution displays.</td>
        </tr>
        <tr>
            <td>if-desktop()</td>
            <td>Yes</td>
            <td rowspan="8">
                Generates media queries that apply styles when the current device being used falls under a breakpoint threshold.
                Uses the breakpoint variables (above) as the ranges for detection.
                The value of <code>$responsive-design</code> determines whether <code>min-width</code>
                or <code>max-width</code> features are used in media queries.
                <b>Properties defined within these mixins will cascade and override where applicable.</b>
            </td>
        </tr>
        <tr>
            <td>if-tablet-landscape()</td>
            <td>Yes</td>
        </tr>
        <tr>
            <td>if-tablet-portrait()</td>
            <td>Yes</td>
        </tr>
        <tr>
            <td>if-mobile-landscape()</td>
            <td>Yes</td>
        </tr>
        <tr>
            <td>if-mobile-portrait()</td>
            <td>Yes</td>
        </tr>
        <tr>
            <td>if-large()</td>
            <td>Yes</td>
        </tr>
        <tr>
            <td>if-medium()</td>
            <td>Yes</td>
        </tr>
        <tr>
            <td>if-small()</td>
            <td>Yes</td>
        </tr>
        <tr>
            <td>in-desktop()</td>
            <td>Yes</td>
            <td rowspan="6">
                Generates media queries that apply styles when the current device being used falls within a certain breakpoint range.
                Uses the breakpoint variables (above) and <code>min-width</code> coupled with <code>max-width</code> for range detection.
                <b>Properties defined within these mixins will not cascade and will only apply within certain ranges.</b>
            </td>
        </tr>
        <tr>
            <td>in-tablet()</td>
            <td>Yes</td>
        </tr>
        <tr>
            <td>in-mobile()</td>
            <td>Yes</td>
        </tr>
        <tr>
            <td>in-large()</td>
            <td>Yes</td>
        </tr>
        <tr>
            <td>in-medium()</td>
            <td>Yes</td>
        </tr>
        <tr>
            <td>in-small()</td>
            <td>Yes</td>
        </tr>

        <tr class="table-divider">
            <td colspan="3">Grid</td>
        </tr>
        <tr>
            <td>grid-row($width)</td>
            <td></td>
            <td>Defines width and wrapper styles for a row in a grid.</td>
        </tr>
        <tr>
            <td>grid-column($width, $gutter)</td>
            <td></td>
            <td>Defines width, margin, and gutter styles for a column in a grid.</td>
        </tr>
    </tbody>
</table>

## Functions ##

Like mixins, functions allow re-use of code. The following functions exist within Toolkit,
and more information on their use can be found below.

<table class="table is-striped data-table">
    <thead>
        <tr>
            <th>Function</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>black($opacity)</td>
            <td>Output a black background with alpha transparency using <code>rgba()</code>.</td>
        </tr>
        <tr>
            <td>white($opacity)</td>
            <td>Output a white background with alpha transparency using <code>rgba()</code>.</td>
        </tr>
        <tr>
            <td>join-classes($classes, $inherit)</td>
            <td>Join a list of classes (without .) as a CSS selector. If inherit is true, inherit from parent with <code>&</code>.</td>
        </tr>
        <tr>
            <td>grid-gutter($grid-width, $gutter)</td>
            <td>
                Calculate the gutter margin between columns as a percentage, using the max width of the grid as a base.
                The gutter value supports most unit measurements, or false can be used for no gutter.
            </td>
        </tr>
        <tr>
            <td>grid-span($column, $max-columns, $grid-width, $gutter)</td>
            <td>
                Calculate the width of an individual grid column as a percentage, taking into account the max grid width and gutter.
            </td>
        </tr>
        <tr>
            <td>strip-unit($value)</td>
            <td>Strip the unit measurement off a value and return the integer.</td>
        </tr>
        <tr>
            <td>to-pixel($from)</td>
            <td rowspan="4">
                Converts from one type of unit measurement to another.
                Conversions use the <code>$base-size</code> variable as a foundation for determining 100% equivalent scaling.
            </td>
        </tr>
        <tr>
            <td>to-percent($from)</td>
        </tr>
        <tr>
            <td>to-rem($from)</td>
        </tr>
        <tr>
            <td>to-em($from)</td>
        </tr>
    </tbody>
</table>

## Unit Conversion ##

Converting between unit types in Sass is rather complex and tedious as too many external variables are involved.
To save everyone time, we took the grunt of the work and implemented a system for converting between unit types.
The following units of measurement are supported: `px`, `em`, `rem`, and `%`.

Conversion is split into the following functions, `to-pixel(from)`, `to-percent(from)`, `to-rem(from)`, and `to-em(from)`,
with all functions accepting a single argument - the unit measurement to convert from.

```scss
$base-size: 16px; // 16px = 1, 1600px = 100

to-pixel(3rem); // 48px
to-percent(550px); // 34%
to-rem(52%); // 52rem
to-em(123px); // 7.6em
```

When calculating, `16px`, `1%`, `1rem`, and `1em` are equivalent, so use accordingly.
The primary focus of these functions is to calculate correctly scaled widths for grids.

Another useful function is `strip-unit(value)`, which will remove the unit of measurement and return the literal number.
This function is used heavily in the other conversion functions.

```scss
strip-unit(15px); // 15
```

## Media Queries & Responsiveness ##

Responsive design is the way of the future, as it allows a single website to render differently across multiple devices and resolutions.
Because Toolkit follows the mobile first and responsive design philosophies, many features have been developed to
aid in the implementation of responsive websites.

The first of which is cascading inheritance through media queries &mdash; the foundation for mobile first design.
The concept behind this pattern is that CSS (or Sass) should be initially written for mobile devices, and any additional styles
should be inherited for larger devices through media queries. This improves mobile rendering speeds as the lowest amount of CSS properties
are being used. When using this approach, the `$responsive-design` variable should be set to `mobile`.

Let's now see this approach in action by creating a unordered list that displays vertically in mobile, and horizontally in larger devices.

```scss
// Menu should stack vertically by default
.menu {
    @include reset-list;

    a {
        display: block;
        padding: .5rem 1rem;
    }
}

// Render horizontally in medium sized devices and above
@include if-medium() {
    .menu {
        @include clear-fix;

        li { float: left; }
    }
}

// Increase the link sizes in large devices and above
@include if-large() {
    .menu a {
        padding: 1rem 2rem;
    }
}
```

<div class="notice is-info">
    If you prefer doing the reverse and implementing desktop first, be sure to set `$responsive-design` to `desktop`,
    and swapping the mixins that are used.
</div>

We can also swap images for high resolution devices.

```scss
.icon {
    background: url('/img/icon.png') no-repeat;
    background-size: 16px 16px;

    // Use a 32x32 icon for retina displays
    @include if-retina() {
        background-image: url('/img/icon@2x.png');
    }
}
```

Or toggle the display of an element depending on device orientation.

```scss
.hero {
    width: 100%;
    height: auto;

    // 4x3 in portrait
    @include if-portrait() {
        padding-bottom: 75%;
    }

    // 16x9 in landscape
    @include if-landscape() {
        padding-bottom: 56.25%
    }
}
```

For greater compatibility, the [Responsive component](../components/responsive.md) provides a handful of helper classes,
so be sure to check those out as well!

## Grid Building ##

Even though Toolkit comes bundled with a robust responsive [Grid component](../components/grid.md),
there may be instances where you want to create your own grids.
This is entirely possible using the grid functions and mixins listed above.

Let's make use of the grid helpers to structure a list with 5 items that should be evenly spaced out.
The first thing we need to do is create the wrapper with `grid-row()`, and the column with `grid-column()`.

```scss
.block-grid {
    @include reset-list;
    @include grid-row(500px); // 500px wide

    li {
        @include grid-column(500px, 20px); // 20px gutter
    }
}
```

Now that we have the basic structure, we need to add the widths for each of the 5 items.
We can accomplish this by calling `grid-span()` and supplying the column count, grid width, and gutter size.

```scss
.block-grid li {
    // Get the width for 1 column out of 5 with a 20px gutter
    width: grid-span(1, 5, 500px, 20px);
}
```