# Pagination #

Divides content into multiple pages through a list of numerical links.

## Usage ##

The pagination markup makes use of `nav` and `ol` elements for semantic structuring. Each link within the pagination should point to a specific page for the list of results.

```html
<nav class="pagination">
    <ol>
        <li><a href="?page=1" class="button">1</a></li>
        <li class="is-active"><a href="?page=2" class="button">2</a></li>
        <li><a href="?page=3" class="button">3</a></li>
    </ol>
</nav>
```

The links in the pagination can be placed wherever and however we please. Require next and previous links? Add them. What about first and last links? Add them also.

<div class="notice is-info">
    In the example above, we are using a <code>.button</code>. This is not required by pagination, but can be used for quick mocking.
</div>

### Grouped Links ###

By default, all links in a pagination list will be spaced out evenly. To group all links into a single solid bar, use the `.pagination--grouped` modifier.

```html
<nav class="pagination pagination--grouped">
    ...
</nav>
```

Grouped paginations can also make use of certain effects, like `.round`, `.pill`, `.oval`, and `.skew`.

```html
<nav class="pagination pagination--grouped round">
    ...
</nav>
```

<div class="notice is-warning">
    All effects (excluding round) are disabled by default. Modify the <code>$pagination-effects</code> Sass variable to enable them.
</div>

### Notes ###

* The current page in the list should have an `.is-active` on the parent `li`.

## ARIA ##

The `navigation` role and the appropriate `aria-*` attributes are required when supporting ARIA.

```html
<nav class="pagination" role="navigation" aria-label="Paged Navigation">
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
            <td>$pagination-class</td>
            <td>.pagination</td>
            <td>CSS class name for the pagination list.</td>
        </tr>
        <tr>
            <td>$pagination-class-modifier-grouped</td>
            <td>.pagination--grouped</td>
            <td>CSS class name for the pagination grouped modifier.</td>
        </tr>
        <tr>
            <td>$pagination-effects</td>
            <td>()</td>
            <td>List of effects to include in the CSS output. Accepts oval, pill, and skew.</td>
        </tr>
        <tr>
            <td>$pagination-modifiers</td>
            <td>("grouped")</td>
            <td>List of modifiers to include in the CSS output. Accepts grouped.</td>
        </tr>
    </tbody>
</table>
