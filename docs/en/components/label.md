# Label #

Labels and badges for simplistic information.

## Usage ##

Labels are small indicators that give descriptions and additional information to sections of content.
Label sizing will always be smaller than their parents, allowing for easier inline integration.

```html
<h2>Breaking news! <span class="label">New</span></h2>
```

<div class="notice is-info">
    Labels will automatically collapse and hide themselves if no content exists.
    This is achieved through the <code>:empty</code> pseudo.
</div>

### Badges ###

Highlight new or unread notifications by using a `.label--badge`.
A badge is represented with a circular shape.

```html
<a href="/messages">Inbox <span class="label label--badge">26</span></a>
```

### Arrows ###

Attract attention to an item by using `.label--arrow-left` or `.label--arrow-right`.
An arrow looks like a regular label, with one side pointing in a direction.

```html
<a href="/archives">Archives <span class="label label--arrow-right">View</span></a>
```

### Ribbons ###

Improve the aesthetics of a label by wrapping it around another element using
`.label--ribbon-left` or `.label--ribbon-right`. A ribbon looks like a regular label,
with one side folding down as if it's wrapping an element.

```html
<span class="label label--ribbon-left">Task List</span>
```

### Sizes ###

Adding a `.small` or `.large` class to the `.label` element will alter the padding and font size.

```html
<span class="label small">Small Label</span>
```
