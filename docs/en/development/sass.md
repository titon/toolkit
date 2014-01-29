# Sass Development #

* [Variables](#variables)
* [Mixins](#mixins)
* [Functions](#functions)
* [Unit Conversion](#unit-conversion)
* [Media Queries & Responsiveness](#media-queries--responsiveness)
* [Grid Building](#grid-building)

## Variables ##

Toolkit provides many variables for adjusting and modifying functionality within the Sass layer &mdash;
it *does not* provide variables for property styling. This can and should be achieved by writing Sass (or CSS) after installing Toolkit.

The following variables alter the output of class names.

<table class="table">
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
            <td>$state-is-prefix</td>
            <td>is-</td>
            <td rowspan="2">Prefix to append to state classes, like active, disabled, failed, and children.</td>
        </tr>
        <tr>
            <td>$state-has-prefix</td>
            <td>has-</td>
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
    </tbody>
</table>

The following variables are used for font sizing and measurement scaling.

<table class="table">
    <tbody>
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
    </tbody>
</table>

The following variables are used for element spacing.

<table class="table">
    <tbody>
        <tr>
            <td>$small-size</td>
            <td>.7rem</td>
            <td>Font size for elements with the <code>.small</code> class.</td>
        </tr>
        <tr>
            <td>$medium-size</td>
            <td>inherit</td>
            <td>Font size for elements with the <code>.medium</code> class. Is also the default font size for elements.</td>
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
            <td>Padding for elements with the <code>.medium</code> class. Is also the default padding for elements.</td>
        </tr>
        <tr>
            <td>$large-padding</td>
            <td>1rem</td>
            <td>Padding for elements with the <code>.large</code> class.</td>
        </tr>
    </tbody>
</table>

The following variables are used for border styles.

<table class="table">
    <tbody>
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
    </tbody>
</table>

The following variables are used for styling elements with colors.

<table class="table">
    <tbody>
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
    </tbody>
</table>

The following variables are used for responsive design. They will alter the output of certain components.

<table class="table">
    <tbody>
        <tr>
            <td>$responsive-design</td>
            <td>mobile</td>
            <td>
                Determines which type of device to target; accepts <code>mobile</code> or <code>desktop</code>.
                If <code>mobile</code> is used, <code>if/in</code> responsive mixins will use <code>min-width</code> breakpoints in media queries.
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
                Also used as <code>min/max-width</code> in <code>in/if</code> responsive mixins.
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
                Also used as <code>min/max-width</code> in <code>in/if</code> responsive mixins.
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

The following variables are used for grid rendering.

<table class="table">
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
            <td>9</td>
        </tr>
        <tr>
            <td>$grid-columns-small</td>
            <td>6</td>
        </tr>
    </tbody>
</table>

## Mixins ##

Mixins are a powerful Sass feature that allow for modularity and re-use of code. Toolkit comes bundle with a handful of mixins
that solve everyday problems like grid building, style resets, and media query management.

The following mixins are used for basic layout styling.

<table class="table">
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
            <td>content-spacing()</td>
            <td></td>
            <td>Removes top and bottom margin on p, ul, ol, hr, and blockquote child elements.</td>
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
    </tbody>
</table>

The following mixins apply styles for state classes.

<table class="table">
    <tbody>
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
    </tbody>
</table>

The following mixins aid in the building of grids. More information on grids can be found below.

<table class="table">
    <tbody>
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

The following mixins generate media queries for use in responsive layouts. More information on responsiveness can be found below.

<table class="table">
    <tbody>
        <tr>
            <td>if-min($min)</td>
            <td>Yes</td>
            <td rowspan="3">
                Generates media queries using <code>min-width</code> and or <code>max-width</code> features.
            </code>
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
            <td rowspan="2">Generates media queries for device orientation.</code>
        </tr>
        <tr>
            <td>if-portrait()</td>
            <td>Yes</td>
        </tr>
        <tr>
            <td>if-retina()</td>
            <td>Yes</td>
            <td>Generates media queries for detecting retina displays.</code>
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
            </code>
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
            </code>
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
    </tbody>
</table>

## Functions ##

## Unit Conversion ##

Converting between unit types in Sass is rather complex and tedious as too many external variables are involved.
To save everyone time, we took the grunt of the work and implemented a system for converting between unit types.
The following units of measurement are supported: `px`, `em`, `rem` and `%`.

Conversion is split into the following functions, `to-pixel(from)`, `to-percent(from)`, `to-rem(from)`, and `to-em(from)`,
with all functions accepting a single argument - the unit measurement to convert from.
Conversions use the `$base-size` variable as a foundation for determining 100% equivalent scaling.
This allows for percent conversion to be exact.

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

## Media Queries & Responsiveness ##

## Grid Building ##