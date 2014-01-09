# Sass Development #

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
            <td>Prefix to append to certain state classes, like active and disabled.</td>
        </tr>
        <tr>
            <td>$state-has-prefix</td>
            <td>has-</td>
            <td>Prefix to append to other state classes, like failed and children.</td>
        </tr>
        <tr>
            <td>$size-small-class</td>
            <td>small</td>
            <td rowspan="3">Name for global sizing classes.</td>
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
            <td rowspan="6">Heading font sizes.</td>
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

## Mixins ##

## Functions ##

## Unit Type Conversion ##

## Media Queries & Responsiveness ##

## Grid Building ##