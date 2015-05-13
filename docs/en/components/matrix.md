# Matrix #

Arranges multiple elements of variable sizes into a uniform grid with exact spacing in between.

## Usage ##

A matrix is a type of grid that re-arranges items into an optimal position based on vertical and horizontal space &mdash; also known as a masonry grid. The matrix takes into account gutter spacing, inline images, multiple spanning columns, and much more.

To begin, the matrix markup requires an unordered list. Each item in the list can use custom markup, but will require a fixed width (defined by the `width` option).

```html
<ul class="matrix">
    <li><!-- Item content --></li>
    ...
</ul>
```

Once the markup is in place, the matrix can be initialized.

```javascript
$('.matrix').matrix();
```

### Adding & Removing Items ###

To add or remove items after the matrix has rendered, we can use `append()`, `prepend()`, and `remove()`. But first, we need to fetch the instantiated matrix object.

```javascript
var matrix = $('.matrix').toolkit('matrix');
```

When adding items to the matrix, the element being added must be an `li`, or a jQuery object representing an `li`.

```javascript
var li = document.createElement('li');
// Add content to the li

matrix.append(li);
matrix.prepend(li);
```

When removing an item, an element that is currently within the matrix must be passed to `remove()`.

```javascript
var li = $('.matrix').find('li:eq(10)');

// Remove it
matrix.remove(li);

// Equivalent to
li.remove();
matrix.refresh();
```

### Fluid Images ###

When columns are rendered, their widths may fluctuate a few pixels to scale accordingly. Because of this, fixed width images may render incorrectly, or just look off. We suggest adding `.fluid` from the [base CSS](../development/css/base.md) to all inline images.

```html
<li>
    <img src="/img/banner.png" class="fluid">
    ...
</li>
```

### Notes ###

* The wrapper will have `.no-columns` added when the viewport is too small for multiple columns.
* The matrix will automatically re-render when the viewport is resized.

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
            <td>$matrix-class</td>
            <td>.matrix</td>
            <td>CSS class name for the matrix list.</td>
        </tr>
        <tr>
            <td>$matrix-transition</td>
            <td>.3s</td>
            <td>The transition time for matrix item position animations.</td>
        </tr>
    </tbody>
</table>

## Options ##

Inherits all options from the [parent Component](component.md#options).

<table class="table is-striped data-table">
    <thead>
        <tr>
            <th>Option</th>
            <th>Type</th>
            <th>Default</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>defer</td>
            <td>bool</td>
            <td>true</td>
            <td>
                Defer positioning of items until all images within the items have loaded.
                If this is false, items may overlap once images load after the fact.
            </td>
        </tr>
        <tr>
            <td>gutter</td>
            <td>int</td>
            <td>20</td>
            <td>The margin between each item and or column.</td>
        </tr>
        <tr>
            <td>rtl</td>
            <td>bool</td>
            <td>Toolkit.isRTL</td>
            <td>Render items in reverse order for right-to-left languages.</td>
        </tr>
        <tr>
            <td>width</td>
            <td>int</td>
            <td>200</td>
            <td>The virtual column width to align all items against. Larger items may span multiple columns.</td>
        </tr>
    </tbody>
</table>

## Events ##

Inherits all events from the [parent Component](component.md#events).

<table class="table is-striped data-table">
    <thead>
        <tr>
            <th>Event</td>
            <th>Arguments</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>appending</td>
            <td>element:item</td>
            <td>Triggered before an element is appended to the matrix.</td>
        </tr>
        <tr>
            <td>prepending</td>
            <td>element:item</td>
            <td>Triggered before an element is prepended to the matrix.</td>
        </tr>
        <tr>
            <td>removing</td>
            <td>element:item</td>
            <td>Triggered before an element is removed from the matrix.</td>
        </tr>
        <tr>
            <td>rendering</td>
            <td></td>
            <td>
                Triggered before the matrix is rendered.
                This can happen on initialization, refresh, or appending, prepending, and removing of items.
            </td>
        </tr>
        <tr>
            <td>rendered</td>
            <td></td>
            <td>Triggered after the matrix is rendered.</td>
        </tr>
    </tbody>
</table>

## Properties ##

Inherits all properties from the [parent Component](component.md#properties).

<table class="table is-striped data-table">
    <thead>
        <tr>
            <th>Property</th>
            <th>Type</th>
            <th>Description</th>
            <th>Found With</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>colCount</td>
            <td>int</td>
            <td>The number of columns that can fit within the current wrapper width.</td>
            <td></td>
        </tr>
        <tr>
            <td>colHeights</td>
            <td>array</td>
            <td>The current height of each column.</td>
            <td></td>
        </tr>
        <tr>
            <td>colWidth</td>
            <td>int</td>
            <td>The calculated width of each column based on the <code>width</code> option.</td>
            <td></td>
        </tr>
        <tr>
            <td>images</td>
            <td>collection</td>
            <td>A collection of <code>img</code>s found within matrix items. Is used for deferred loading.</td>
            <td>img</td>
        </tr>
        <tr>
            <td>items</td>
            <td>collection</td>
            <td>A collection of elements to position in the grid.</td>
            <td>&gt; li</td>
        </tr>
        <tr>
            <td>matrix</td>
            <td>array</td>
            <td>List of items organized in render order with column span detection flags.</td>
            <td></td>
        </tr>
        <tr>
            <td>wrapperWidth</td>
            <td>int</td>
            <td>The width of the matrix wrapper.</td>
            <td></td>
        </tr>
    </tbody>
</table>

## Methods ##

Inherits all methods from the [parent Component](component.md#methods).

<table class="table is-striped data-table">
    <thead>
        <tr>
            <th>Method</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>append(element:item)</td>
            <td>Append an item to the matrix and re-render. The item must be an <code>li</code>.</td>
        </tr>
        <tr>
            <td>prepend(element:item)</td>
            <td>Prepend an item to the matrix and re-render. The item must be an <code>li</code>.</td>
        </tr>
        <tr>
            <td>refresh()</td>
            <td>
                Refresh the <code>items</code> list and re-render.
                This method is automatically called from other methods.
            </td>
        </tr>
        <tr>
            <td>remove(element:item)</td>
            <td>Remove an item from the matrix and re-render. The element must match an existing item in the matrix.</td>
        </tr>
        <tr>
            <td>render()</td>
            <td>
                Render the items into a uniform grid. This method is called automatically.
            </td>
        </tr>
    </tbody>
</table>
