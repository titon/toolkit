# Form #

Classes for input fields and form structuring.

## Usage ##

When building forms, all input fields, select menus, and textareas should use the `.input` class. This class will style, align and position elements uniformly within a form.

```html
<!-- Inputs -->
<input class="input" type="text" name="username">
<input class="input" type="email" name="email">

<!-- Selects -->
<select class="input" name="country"></select>

<!-- Textareas -->
<textarea class="input" rows="5" cols="50"></textarea>
```

All types of `input` are supported, including the latest HTML5 variants.

Inputs should be paired with `.field` for structuring, and `.field-label` for association. Both of which are required for horizontal and inline forms (more on this below).

```html
<div class="field">
    <label class="field-label" for="username">Username</label>
    <input class="input" type="text" name="username" id="username">
</div>
```

Alternatively, you can wrap all your inputs in a `.fields` list. We suggest using this approach for most use cases.

```html
<ul class="fields">
    <li>
        <label class="field-label" for="username">Username</label>
        <input class="input" type="text" name="username" id="username">
    </li>
    <li>
        ...
    </li>
</ul>
```

<div class="notice is-error">
    As a side effect in styling selects in WebKit browsers, their arrow will be missing and will have to manually be fixed.
</div>

### Radios & Checkboxes ###

When working with radios and checkboxes, we suggest wrapping the input in a label with either a `.input-checkbox` or `.input-radio` class.

```html
<label class="input-radio" for="radio">
    <input id="radio" type="radio" name="radio">
    Label
</label>

<label class="input-checkbox" for="checkbox">
    <input id="checkbox" type="checkbox" name="checkbox">
    Label
</label>
```

### States ###

Add the `disabled` attribute to an input to prevent user modification, or add the `readonly` attribute to mark an input as read only.

```html
<input class="input" type="text" name="username" disabled>
<input class="input" type="email" name="email" readonly>
```

To represent success or error states during validation, add the `.is-success` and `.is-error` classes to the parent `.field` or `li`.

```html
<div class="field is-error">
    ...
</div>
```

When a field is required before submission, add the `.is-required` class to the parent `.field` or `li`, and add the `required` attribute to the input.

```html
<div class="field is-required">
    ...
    <input class="input" type="text" name="username" required>
</div>
```

### Sizes ###

To increase the font size and padding of an input, add a `.small` or `.large` class to the `.input`, `.input-radio`, `.input-checkbox`, or `.input-static` element.

```html
<input class="input small" type="email" name="email">
<select class="input small" name="country"></select>
<textarea class="input large" rows="5" cols="50"></textarea>
<label class="input-radio large" for="radio">...</label>
<div class="input-static large">...</div>
```

The size class can also be applied to a parent `.field` or `li`, which will cascade down to all inputs within it.

### Convenience Elements ###

When we need to use plain text instead of an input field, while maintaining the same dimensions and spacing, a static input can be used.

```html
<div class="field">
    <label class="field-label">Email</label>
    <div class="input-static">email@domain.com</div>
</div>
```

Or need to display informational help messages.

```html
<div class="field">
    <label class="field-label" for="about">About</label>
    <textarea class="input" id="about"></textarea>
    <div class="field-help">250 characters remaining</div>
</div>
```

And finally, for wrapping action buttons.

```html
<div class="form-actions">
    <button type="submit" class="button">Save</button>
</div>
```

## Forms ##

No extra styles or classes are required by basic forms, simply go ahead and use the `form` tag.

```html
<form>
    ...
</form>
```

### Fieldsets & Legends ###

Fieldsets and legends can be used to group fields. If a fieldset exists without a legend, the `.no-legend` class can be used to reset its styles.

```html
<form>
    <fieldset>
        <legend>Info</legend>
        ...
    </fieldset>

    <fieldset class="no-legend">
        ...
    </fieldset>
</form>
```

### Horizontal Forms ###

Stacking inputs and labels horizontally instead of vertically will require the [Grid component](grid.md). Adding `.form--horizontal` to a form will update `.field`s behavior to that of a grid row, so no need for `.grid`. We can then insert grid `.col` classes for structuring.

```html
<form class="form--horizontal">
    <ul class="fields">
        <li>
            <label class="field-label col span-4" for="username">Username</label>
            <div class="field-col col span-8">
                <input class="input" type="text" name="username" id="username">
            </div>
        </li>

        <li>
            <label class="field-label col span-4">Email</label>
            <div class="field-col col span-8">
                <div class="input-static">email@domain.com</div>
            </div>
        </li>

        <li class="form-actions">
            <button type="submit" class="button">Save</button>
        </li>
    </ul>
</form>
```

### Inline Forms ###

Adding `.form--inline` to a form will update all `.field`, `.field-label`, and `.form-actions` elements to inline block with proper margins.

```html
<form class="form--inline">
    ...
</form>
```

## ARIA ##

If you are using semantically correct tags like `form`, `label`, and `input`, then implementing ARIA is not required. If you are *not* using them, then the following [MDN article on ARIA forms](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/forms/Basic_form_hints) may be helpful.

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
            <td>$form-class</td>
            <td>.form</td>
            <td>CSS class name for the form element.</td>
        </tr>
        <tr>
            <td>$form-class-actions</td>
            <td>.form-actions</td>
            <td>CSS class name for the form actions (submit buttons, ec) wrapper.</td>
        </tr>
        <tr>
            <td>$form-class-modifier-inline</td>
            <td>.form--inline</td>
            <td>CSS class name for the form inline modifier.</td>
        </tr>
        <tr>
            <td>$form-class-modifier-horizontal</td>
            <td>.form--horizontal</td>
            <td>CSS class name for the form horizontal modifier.</td>
        </tr>
        <tr>
            <td>$form-class-input</td>
            <td>.input</td>
            <td>CSS class name for the input, select, and textarea elements.</td>
        </tr>
        <tr>
            <td>$form-class-input-static</td>
            <td>.input-static</td>
            <td>CSS class name for the static input element.</td>
        </tr>
        <tr>
            <td>$form-class-input-radio</td>
            <td>.input-radio</td>
            <td>CSS class name for the radio input wrapper element.</td>
        </tr>
        <tr>
            <td>$form-class-input-checkbox</td>
            <td>.input-checkbox</td>
            <td>CSS class name for the checkbox input wrapper element.</td>
        </tr>
        <tr>
            <td>$form-class-fields</td>
            <td>.fields</td>
            <td>CSS class name for the fields list element.</td>
        </tr>
        <tr>
            <td>$form-class-field</td>
            <td>.field</td>
            <td>CSS class name for the individual field element.</td>
        </tr>
        <tr>
            <td>$form-class-field-help</td>
            <td>.field-help</td>
            <td>CSS class name for the field help message element.</td>
        </tr>
        <tr>
            <td>$form-class-field-label</td>
            <td>.field-label</td>
            <td>CSS class name for the field label.</td>
        </tr>
        <tr>
            <td>$form-class-field-column</td>
            <td>.field-col</td>
            <td>CSS class name for the field column (used for horizontal layouts).</td>
        </tr>
        <tr>
            <td>$form-modifiers</td>
            <td>("inline", "horizontal")</td>
            <td>List of modifiers to include in the CSS output. Accepts inline and horizontal.</td>
        </tr>
    </tbody>
</table>
