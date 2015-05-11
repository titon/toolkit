# Mixins #

Mixins are a powerful Sass feature that allow for modularity and re-use of code. Toolkit comes bundled with a handful of mixins that solve everyday problems like grid building, style resets, and media query management.

## Layout ##

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
            <td>Provides <code>::after</code> styles on the parent for clearing child floats.</td>
        </tr>
        <tr>
            <td>full-screen($position)</td>
            <td></td>
            <td>Positions an element across the entire viewport horizontally and vertically.</td>
        </tr>
        <tr>
            <td>is-small($self, $parent)</td>
            <td>Yes</td>
            <td rowspan="2">
                Programmatically sets size classes on either the current element, or the parent element, or both, depending on arguments.
            </td>
        </tr>
        <tr>
            <td>is-large($self, $parent)</td>
            <td>Yes</td>
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
            <td>ltr()</td>
            <td>Yes</td>
            <td>Provides styles for elements that have the attribute <code>dir="ltr"</code>.</td>
        </tr>
        <tr>
            <td>rtl()</td>
            <td>Yes</td>
            <td>Provides styles for elements that have the attribute <code>dir="rtl"</code>.</td>
        </tr>
    </tbody>
</table>

## Responsive ##

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
            <td>if-xsmall()</td>
            <td>Yes</td>
            <td rowspan="5">
                Generates media queries that apply styles when the current device being used falls under a breakpoint threshold.
                Uses the breakpoint variables as the ranges for detection.
                The value of <code>$responsive-design</code> determines whether <code>min-width</code>
                or <code>max-width</code> features are used in media queries.
                <b>Properties defined within these mixins will cascade and override where applicable.</b>
            </td>
        </tr>
        <tr>
            <td>if-small()</td>
            <td>Yes</td>
        </tr>
        <tr>
            <td>if-medium()</td>
            <td>Yes</td>
        </tr>
        <tr>
            <td>if-large()</td>
            <td>Yes</td>
        </tr>
        <tr>
            <td>if-xlarge()</td>
            <td>Yes</td>
        </tr>
        <tr>
            <td>in-range($range)</td>
            <td>Yes</td>
            <td>
                Generates media queries within a certain range. Requires a list of 2 items for the min and max breakpoint.
                Passing <code>null</code> for a breakpoint will alter the type of media query used.
            </td>
        </tr>
        <tr>
            <td>in-xsmall()</td>
            <td>Yes</td>
            <td rowspan="5">
                Generates media queries that apply styles when the current device being used falls within a certain breakpoint range.
                Uses the breakpoint variables and <code>min-width</code> coupled with <code>max-width</code> for range detection.
                <b>Properties defined within these mixins will not cascade and will only apply within certain ranges.</b>
            </td>
        </tr>
        <tr>
            <td>in-small()</td>
            <td>Yes</td>
        </tr>
        <tr>
            <td>in-medium()</td>
            <td>Yes</td>
        </tr>
        <tr>
            <td>in-large()</td>
            <td>Yes</td>
        </tr>
        <tr>
            <td>in-xlarge()</td>
            <td>Yes</td>
        </tr>
    </tbody>
</table>

## Flexbox ##

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
            <td>flex-region($width)</td>
            <td></td>
            <td>Sets the max width and display to <code>flex</code> for an element.</td>
        </tr>
        <tr>
            <td>flex-region-align($align)</td>
            <td></td>
            <td>Align blocks within a region along the main axis using <code>justify-content</code>.</td>
        </tr>
        <tr>
            <td>flex-region-orientation($orientation)</td>
            <td></td>
            <td>Set the blocks direction using <code>flex-direction</code>.</td>
        </tr>
        <tr>
            <td>flex-region-wrap($wrap)</td>
            <td></td>
            <td>Enable or disable wrapping for a region using <code>flex-wrap</code>.</td>
        </tr>
        <tr>
            <td>flex-block($width, $grow, $shrink)</td>
            <td></td>
            <td>Set the width, grow, and shrink flex parameters using <code>flex</code>.</td>
        </tr>
        <tr>
            <td>flex-block-align($align)</td>
            <td></td>
            <td>Override a blocks alignment using <code>align-self</code>.</td>
        </tr>
    </tbody>
</table>

## Grids ##

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
            <td>grid-column($width, $gutter)</td>
            <td></td>
            <td>Defines width, margin, and gutter styles for a column in a grid.</td>
        </tr>
        <tr>
            <td>grid-row($width)</td>
            <td></td>
            <td>Defines width and wrapper styles for a row in a grid.</td>
        </tr>
    </tbody>
</table>

