# Divider #

Separates sections of content.

## Usage ##

A divider can be used to separate sections of content, and can also be used for clearing floats.

```html
<div class="divider"></div>
```

<div class="notice is-info">
    The divider requires no whitespace for proper border collapsing, unless content is inserted (below).
</div>

Strings of text can be inserted within the divider, which will be horizontally centered.

```html
<div class="divider">OR</div>
```

If the text is really long, or spans multiple lines, wrap the text in a `span`.

```html
<div class="divider"><span>Chapter 4<br>Page 45</span></div>
```

Icons can also be inserted within the divider.

```html
<div class="divider"><span class="icon-16-star"></span></div>
```

### Styling ###

Dividers make use of `::before` and `::after` pseudo elements for their border effect. When the divider has content, the pseudos are shifted to the side to create a gap for the content. The pseudos should be modified when styling the divider.

```css
.divider::before,
.divider::after {
    border: 1px solid black;
}
```

## ARIA ##

The `separator` role is required when supporting ARIA.

```html
<div class="divider" role="separator"></div>
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
            <td>$divider-class</td>
            <td>.divider</td>
            <td>CSS class name for the divider element.</td>
        </tr>
    </tbody>
</table>
