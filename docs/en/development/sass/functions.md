# Functions #

Like mixins, functions allow for re-use of code. The following functions exist within Toolkit.

## Utility ##

<table class="table is-striped data-table">
    <thead>
        <tr>
            <th>Function</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>bem($block, $element, $modifier, $element-separator: "-", $modifier-separator: "--")</td>
            <td>Output a CSS class name in the BEM (block-element-modifier) format.</td>
        </tr>
        <tr>
            <td>black($opacity)</td>
            <td>Output a black background with alpha transparency using <code>rgba()</code>.</td>
        </tr>
        <tr>
            <td>class-name($class, $prefix: "", $selector: ".")</td>
            <td>Output a CSS class name and apply an optional prefix.</td>
        </tr>
        <tr>
            <td>gutter($width, $gutter)</td>
            <td>
                Calculate the gutter margin between elements as a percentage, using the width as a base.
                The gutter value supports most unit measurements, or false can be used for no gutter.
            </td>
        </tr>
        <tr>
            <td>join-classes($classes, $inherit)</td>
            <td>Join a list of classes (without .) as a CSS selector. If inherit is true, inherit from parent with <code>&</code>.</td>
        </tr>
        <tr>
            <td>span-width($column, $max-columns, $max-width, $gutter)</td>
            <td>
                Calculate the width of an individual element as a percentage, using the current index and taking into account the max width and gutter.
            </td>
        </tr>
        <tr>
            <td>remove-selector($selector)</td>
            <td>Removes the first character selector from a CSS class name or ID.</td>
        </tr>
        <tr>
            <td>white($opacity)</td>
            <td>Output a white background with alpha transparency using <code>rgba()</code>.</td>
        </tr>
    </tbody>
</table>

## Flexbox ##

<table class="table is-striped data-table">
    <thead>
        <tr>
            <th>Function</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>flex-span($column, $max-columns, $grid-width, $gutter)</td>
            <td>Pipes to <code>span-width()</code> using the flex variables.</td>
        </tr>
    </tbody>
</table>

## Grids ##

<table class="table is-striped data-table">
    <thead>
        <tr>
            <th>Function</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>grid-span($column, $max-columns, $grid-width, $gutter)</td>
            <td>Pipes to <code>span-width()</code> using the grid variables.</td>
        </tr>
    </tbody>
</table>

## Type Conversion ##

<table class="table is-striped data-table">
    <thead>
        <tr>
            <th>Function</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
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
