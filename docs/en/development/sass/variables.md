# Variables #

Toolkit provides many variables for adjusting and modifying functionality within the Sass layer &mdash;
it *does not* provide variables for property styling.
This can and should be achieved by writing Sass (or CSS) after installing Toolkit.

## Class Naming ##

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
            <td>$shape-round-class</td>
            <td>round</td>
            <td rowspan="4">Names for global shape classes.</td>
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
    </tbody>
</table>

## Sizing & Spacing ##

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
    </tbody>
</table>

## Border Styles ##

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

## State Colors ##

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

## Responsive Breakpoints ##

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