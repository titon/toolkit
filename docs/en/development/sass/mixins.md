# Mixins #

Mixins are a powerful Sass feature that allow for modularity and re-use of code.
Toolkit comes bundled with a handful of mixins that solve everyday problems like grid building,
style resets, and media query management.

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
    </tbody>
</table>

## States ##

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