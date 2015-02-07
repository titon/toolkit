# Flex #

Layouts and grids based on the flexbox specification. Supports different responsive sizes for blocks.

## Usage ##

### Alignment ###

### Block Sizes ###

### Shrinking & Growing ###

### Ordering ###

### Wrapping ###

### Nesting ###

### Horizontal & Vertical ###

### Spatial Grids ###

### Responsive Blocks ###

### Notes ###

* Blocks must be wrapped with `.region` unless created with `flex-region()`.
* Blocks require a `.block` class.
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
