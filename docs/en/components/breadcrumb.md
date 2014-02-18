# Breadcrumb #

Navigation for hierarchical trails.

## Usage ##

The breadcrumb markup makes use of `nav`, `ul`, and `ol` elements for semantic structuring.
Within each list item is a link and an optional caret. The caret in the last item will be hidden automatically.

```html
<nav class="breadcrumb">
    <ol>
        <li><a href="/">Top Level Page <span class="caret">/</span></a></li>
        <li><a href="/">Major Page <span class="caret">/</span></a></li>
        <li><a href="/">Minor Page <span class="caret">/</span></a></li>
    </ol>
</nav>
```

<div class="notice is-info">
    Applying a <code>.small</code> or <code>.large</code> class to the <code>nav</code> element
    will alter the padding and font size of the breadcrumb.
</div>