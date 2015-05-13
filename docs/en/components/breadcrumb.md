# Breadcrumb #

Navigation for hierarchical trails.

## Usage ##

The breadcrumb markup makes use of `nav`, `ul`, and `ol` elements for semantic structuring. Within each list item is a link and an optional caret. The caret in the last item will be hidden automatically.

```html
<nav class="breadcrumb">
    <ol>
        <li><a href="/">Major Page <span class="caret">/</span></a></li>
        <li><a href="/">Minor Page <span class="caret">/</span></a></li>
        <li><a href="/">Sub Page <span class="caret">/</span></a></li>
    </ol>
</nav>
```

### Sizes ###

Applying a `.small` or `.large` class to the `.breadcrumb` element will alter the padding and font size.

```html
<nav class="breadcrumb large">
    ...
</nav>
```

## ARIA ##

The `navigation` role and the appropriate `aria-*` attributes are required when supporting ARIA.

```html
<nav class="breadcrumb" role="navigation" aria-label="Breadcrumb Navigation">
    ...
</nav>
```

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
            <td>$breadcrumb-class</td>
            <td>.breadcrumb</td>
            <td>CSS class name for the breadcrumb element.</td>
        </tr>
    </tbody>
</table>
