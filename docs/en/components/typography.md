# Typography #

Variable font scaling and text styling for headers, paragraphs, lists, and other text based elements.

## Usage ##

The typography component provides a base font size (14px) and line height (1.25em) on the `html` tag, which in turn allows for consistent `rem` font scaling. These values can be changed through `$base-size` and `$base-line-height` variables, or by overriding the `html` tag.

```css
html {
    font-size: 16px;
    line-height: 1.5em;
}
```

### Headings ###

All `h1` through `h6` headings have been styled for consistent presentation. This includes removing padding and margin, and re-scaling based on `rem`. These values can be changed through `$h1-size`, `$h2-size`, etc, variables.

<table class="table is-striped data-table">
    <thead>
        <tr>
            <th>Heading</th>
            <th>REM Scale</th>
            <th>PX Equivalent</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>h1</td>
            <td>3rem</td>
            <td>42px</td>
        </tr>
        <tr>
            <td>h2</td>
            <td>2.5rem</td>
            <td>35px</td>
        </tr>
        <tr>
            <td>h3</td>
            <td>2.1rem</td>
            <td>29px</td>
        </tr>
        <tr>
            <td>h4</td>
            <td>1.8rem</td>
            <td>25px</td>
        </tr>
        <tr>
            <td>h5</td>
            <td>1.5rem</td>
            <td>21px</td>
        </tr>
        <tr>
            <td>h6</td>
            <td>1.2rem</td>
            <td>17px</td>
        </tr>
    </tbody>
</table>

### Paragraphs & Lists ###

Both paragraphs and lists have been modified with a consistent margin, which can be altered through the `$margin` variable.

### Blockquotes ###

Use a `blockquote` and an optional `cite` for quoting content from external sources.

```html
<blockquote>
    <p>Titon Toolkit makes it easy to build responsive designs for mobile and desktop devices.</p>
    <cite>Miles Johnson</cite>
</blockquote>
```

### Contextual Copy ###

Improve copy by altering the meaning through coloring. Each class represents a different contextual state.

```html
<p class="text-muted">...</p>
<p class="text-info">...</p>
<p class="text-success">...</p>
<p class="text-warning">...</p>
<p class="text-error">...</p>
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
    </tbody>
</table>
