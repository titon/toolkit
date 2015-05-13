# Label #

Labels and badges for simplistic information.

## Usage ##

Labels are small indicators that give descriptions and additional information to sections of content. Label sizing will always be smaller than their parents, allowing for easier inline integration.

```html
<h2>Breaking news! <span class="label">New</span></h2>
```

<div class="notice is-info">
    Labels will automatically collapse and hide themselves if no content exists. This is achieved through the <code>:empty</code> pseudo.
</div>

### Badges ###

Highlight new or unread notifications by using a `.label--badge`. A badge is represented with a circular shape.

```html
<a href="/messages">Inbox <span class="label label--badge">26</span></a>
```

### Arrows ###

Attract attention to an item by using `.label--arrow-left` or `.label--arrow-right`. An arrow looks like a regular label, with one side pointing in a direction.

```html
<a href="/archives">Archives <span class="label label--arrow-right">View</span></a>
```

### Ribbons ###

Improve the aesthetics of a label by wrapping it around another element using `.label--ribbon-left` or `.label--ribbon-right`. A ribbon looks like a regular label, with one side folding down as if it's wrapping an element.

```html
<span class="label label--ribbon-left">Task List</span>
```

### Sizes ###

Adding a `.small` or `.large` class to the `.label` element will alter the padding and font size.

```html
<span class="label small">Small Label</span>
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
            <td>$label-class</td>
            <td>.label</td>
            <td>CSS class name for the label element.</td>
        </tr>
        <tr>
            <td>$label-class-modifier-arrow-left</td>
            <td>.label--arrow-left</td>
            <td>CSS class name for the label left arrow modifier.</td>
        </tr>
        <tr>
            <td>$label-class-modifier-arrow-right</td>
            <td>.label--arrow-right</td>
            <td>CSS class name for the label right arrow modifier.</td>
        </tr>
        <tr>
            <td>$label-class-modifier-badge</td>
            <td>.label--badge</td>
            <td>CSS class name for the label badge modifier.</td>
        </tr>
        <tr>
            <td>$label-class-modifier-ribbon-left</td>
            <td>.label--ribbon-left</td>
            <td>CSS class name for the label left ribbon modifier.</td>
        </tr>
        <tr>
            <td>$label-class-modifier-ribbon-right</td>
            <td>.label--ribbon-right</td>
            <td>CSS class name for the label right ribbon modifier.</td>
        </tr>
        <tr>
            <td>$label-modifiers</td>
            <td>("badge", "ribbon-left", "ribbon-right", "arrow-left", "arrow-right")</td>
            <td>List of modifiers to include in the CSS output. Accepts badge, ribbon-left, ribbon-right, arrow-left, and arrow-right.</td>
        </tr>
    </tbody>
</table>
