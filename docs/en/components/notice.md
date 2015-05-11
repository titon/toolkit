# Notice #

Notification boxes for displaying informational, error, warning, or success messages.

## Usage ##

A notice provides contextual messages for specific types of actions &mdash; usually as a flash message. Notices work best when paired with the global info, success, warning, and error state classes.

```html
<div class="notice">
    <b>Hey!</b> You should check this out.
</div>

<div class="notice is-info">
    <b>Take Note!</b> This is informational, but not critically important.
</div>

<div class="notice is-success">
    <b>Congrats!</b> You successfully did something.
</div>

<div class="notice is-warning">
    <b>Warning!</b> Somethings gone wrong, you should check it out.
</div>

<div class="notice is-error">
    <b>Oh No!</b> Things are broken, we don't know why.
</div>
```

<div class="notice is-warning">
    All state classes will require styling. The classes simply exist for semantic and structuring reasons.
</div>

### Custom Markup ###

Notices are designed to gracefully handle links, paragraphs, lists, hrs, and blockquotes.

```html
<div class="notice">
    <p>This message is so long, that it had to be split into 2 paragraphs.</p>
    <hr>
    <p>Sorry about that, won't happen again. <a href="">Learn why</a>.</p>
</div>
```

They also support titles with `.notice-title`. We suggest pairing with `h1`-`h6` tags.

```html
<div class="notice">
    <h2 class="notice-title">Pay Attention</h2>
    <p>We have something important to tell you.</p>
</div>
```

### Closing Notices ###

Make a notice dismissable by placing a close button.

```html
<div class="notice">
    <button type="button" class="notice-close"><span class="x"></span></button>
    <p>This message isn't that important, so we made it dismissable.</p>
</div>
```

<div class="notice is-warning">
    The JavaScript for closing notices will need to be custom written. Toolkit does not provide any functionality for this.
</div>

## ARIA ##

The `alert` or `status` role is required when supporting ARIA. [Learn more about this role.](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_alert_role)

```html
<div class="notice is-info" role="status">...</div>
<div class="notice is-success" role="status">...</div>
<div class="notice is-warning" role="alert">...</div>
<div class="notice is-error" role="alert">...</div>
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
            <td>$notice-class</td>
            <td>.notice</td>
            <td>CSS class name for the notice wrapper.</td>
        </tr>
        <tr>
            <td>$notice-class-close</td>
            <td>.notice-close</td>
            <td>CSS class name for the notice close button.</td>
        </tr>
        <tr>
            <td>$notice-class-title</td>
            <td>.notice-title</td>
            <td>CSS class name for the notice title.</td>
        </tr>
    </tbody>
</table>
