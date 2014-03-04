# Pagination #

Divides content into multiple pages through a list of numerical links.

## Usage ##

The pagination markup makes use of `nav`, `ul`, and `ol` elements for semantic structuring.
Each link within the pagination should point to a specific page for the list of results.

```html
<nav class="pagination">
    <ol>
        <li><a href="?page=1" class="button">1</a></li>
        <li class="is-active"><a href="?page=2" class="button">2</a></li>
        <li><a href="?page=3" class="button">3</a></li>
    </ol>
</nav>
```

The links in the pagination can be placed wherever and however you please.
Require next and previous links? Add them. What about first and last links? Add them also.

<div class="notice is-info">
    In the example above, we are using a <code>.button</code>.
    This is not required by pagination, but can be used for quick mocking.
</div>

### Grouped Links ###

By default, all links in a pagination list will be spaced out evenly.
To group all links into a single solid bar, use the `.pagination--grouped` modifier.

```html
<nav class="pagination--grouped">
    ...
</nav>
```

Grouped paginations can also make use of [certain effects](effects.md), like `.round`, and `.pill`.

```html
<nav class="pagination--grouped round">
    ...
</nav>
```

## Notes ##

* The current page in the list should have an `.is-active` on the parent `li`.