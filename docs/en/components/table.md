# Table #

Provides styles for tables and their common use cases.

## Usage ##

The table component removes the overhead of table styling and structuring,
by collapsing borders, fine-tuning cell spacing, and adding modifiers for common use cases.
To make use of this functionality, add `.table` to a `table` tag.

```html
<table class="table">
    <thead>
        <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Username</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Miles</td>
            <td>Johnson</td>
            <td>@mileswjohnson</td>
        </tr>
        ...
    </tbody>
</table>
```

When using the table component, all rows must be wrapped in a `thead` or `tbody`,
and proper placement of `td`s and `th`s are required.

### Modifiers ###

To add zebra-striping to all rows in a `tbody`, add `.is-striped`.

```html
<table class="table is-striped">
    ...
</table>
```

To add a hover state to all rows in a `tbody`, add `.has-hover`.

```html
<table class="table has-hover">
    ...
</table>
```

### Sizes ###

Add a `.small` or `.large` class to the `table` to alter the padding of all cells.

```html
<table class="table large">
    ...
</table>
```

### Sortable Headers ###

Add an `.is-sortable` class to the `table` to enable sortable headers.
All columns in a `thead` will need to be wrapped in an `a` or `span`.

```html
<table class="table is-sortable">
    <thead>
        <tr>
            <th><a href="">Title</a></th>
            <th><a href="">Description</a></th>
            <th><span>Actions</span></th>
        </tr>
    </thead>
    <tbody>
        ...
    </tbody>
</table>
```

Use `.sorter` from the [base component](base.md#sorter) for ascending and descending arrows.

```html
<th>
    <a href="">
        Title
        <span class="sorter asc">
            <span class="caret-up"></span>
            <span class="caret-down"></span>
        </span>
    </a>
</th>
```

### Responsive Tables ###

Support responsive design by wrapping all `.table`s in `.table-responsive`, which allows
tables to scroll horizontally when bleeding out of the viewport or their container.

```html
<div class="table-responsive">
    <table class="table">
        ...
    </table>
</div>
```