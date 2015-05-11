# Input Group #

Group input fields with addons by collapsing spacing in between.

## Usage ##

Like the [button group](button-group.md), the input group allows for grouping of elements. The input group supports grouping of input fields (that implement `.input`), buttons, button groups, and addons. Addons are elements that can be used as the first, middle, or last element of a grouping.

For example, we can place an addon as the first element to indicate currency.

```html
<div class="input-group">
    <span class="input-addon">$</span>
    <input class="input" name="currency" type="text">
</div>
```

Or we can place the addon in the middle &mdash; which works perfectly for emails.

```html
<div class="input-group">
    <input class="input" name="email[user]" type="text">
    <span class="input-addon">@</span>
    <input class="input" name="email[domain]" type="text">
</div>
```

And lastly, it can be used as the last element.

```html
<div class="input-group">
    <span class="input-addon">http://</span>
    <input class="input" name="url" type="text">
    <span class="input-addon">.domain.com</span>
</div>
```

### Sizes ###

Adding `.small` or `.large` to the `.input-group` will resize the inner inputs, addons, and buttons accordingly.

```html
<div class="input-group small">
    <input class="input" name="rate" type="number">
    <span class="input-addon">%</span>
</div>
```

### Button Integration ###

Alongside input fields, buttons and button groups can be placed within an input group. This allows for awesome functionality, like paired inputs and submit buttons, or segmented buttons with a drop menu of actions.

```html
<div class="input-group">
    <input class="input" name="keyword" type="search">
    <button type="submit" class="button">Search</button>
</div>
```

```html
<div class="input-group">
    <input class="input" name="filter" type="text">
    <div class="button-group">
        <button type="submit" class="button">Filter</button>
        <button type="button" class="button" data-drop="filters"><span class="caret-down"></span></button>

        <ul class="drop--down" id="filters">
            ...
        </ul>
    </div>
</div>
```

<div class="notice is-warning">
    When grouping <code>.button</code>s and <code>.button-group</code>s, a fixed height may need to be applied as line heights, padding, and font sizes differ between browsers, which makes it rather complicated to align correctly.
</div>

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
            <td>$inputGroup-class</td>
            <td>.input-group</td>
            <td>CSS class name for the input group wrapper.</td>
        </tr>
        <tr>
            <td>$inputGroup-class-addon</td>
            <td>.input-addon</td>
            <td>CSS class name for the input group addon element.</td>
        </tr>
    </tbody>
</table>
