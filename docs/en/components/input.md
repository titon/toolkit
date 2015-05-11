# Input #

Replaces selects, checkboxes, and radios with custom elements.

## Usage ##

The input component is unique in the fact that it's 4 components bundled together. It provides the `Input` class that replaces all selects, checkboxes, and radios in a form. It also provides the `InputCheckbox`, `InputRadio`, and `InputSelect` classes that replace their respective individual element.

To replace all selects, checkboxes, and radios in a form, call `input()` on the form.

```javascript
$('form').input();
```

By default this will replace all elements it can find within the form. To filter which elements can be replaced, specific options can be passed in.

```javascript
$('form').input({
    select: 'select.with-class',
    checkbox: '.only-a-class',
    radio: 'input[type="checkbox"][data-attr]'
});
```

### Checkboxes & Radios ###

To replace an individual checkbox or radio, instead of replacing all like mentioned above, use `inputCheckbox()` and `inputRadio()`.

```javascript
$('#checkbox').inputCheckbox();
$('#radio').inputRadio();
```

All checkboxes and radios will be replaced with the following markup.

```html
<div class="custom-input">
    <!-- The original input that gets wrapped -->
    <input id="radio" type="radio" name="radio">

    <!-- The label styled to look like a radio -->
    <label for="radio" class="radio"></label>
</div>

<div class="custom-input">
    <!-- The original input that gets wrapped -->
    <input id="checkbox" type="checkbox" name="checkbox">

    <!-- The label styled to look like a checkbox -->
    <label for="checkbox" class="checkbox"></label>
</div>
```

No JavaScript is used for toggling the checked state, as `:checked` on the original input is used. To style this state, the following CSS can be used.

```css
.custom-input input:checked + .radio { ... }
.custom-input input:checked + .checkbox { ... }
```

<div class="notice is-warning">
    An ID attribute on the original input is required for this component to work properly.
</div>

### Selects ###

To replace an individual select, use `inputSelect()`.

```javascript
$('#select').inputSelect();
```

All selects will be replaced with the following markup.

```html
<div class="custom-input">
    <!-- The original select that gets wrapped -->
    <select>...</select>

    <div class="select" data-select>
        <div class="select-arrow" data-select-arrow><span class="caret-down"></span></div>
        <div class="select-label" data-select-label>...</div>
    </div>

    <!-- The custom dropdown if native is false -->
    <div class="drop--down select-options" data-select-options>
        <ul>...</ul>
    </div>
</div>
```

#### Labels & Descriptions ####

The native selects are rather restrictive on what they can do, and how they can be customized. Because of this, a custom title, label, and description system has been implemented.

To display a default label in multi-selects when no items are selected, use `getDefaultLabel`.

```html
<select name="select" title="-- Choose One --" multiple>
    ...
</select>
```

To display a custom label when an option is selected, use `getOptionLabel`. To include an optional description below the label, use `getDescription`.

```html
<option value="1" title="USA">United States</option>
...
<option value="1" data-description="Hyper-Text Markup Language">HTML</option>
```

### Notes ###

* Checkboxes and radios use `:checked` on the original input for their active state.
* Selected options will have `.is-active` applied to their parent `li`.
* An `.is-active` class will be added to `.select` when a menu is open.
* An `.is-multiple` class will be added to the multi-select dropdown.
* Optgroups will be converted to `.drop-heading` within the dropdown.
* Adding `disabled` to an option or optgroup will disable all related options.

## ARIA ##

The `listbox` and `option` roles are required for custom select drop menus when supporting ARIA.

<div class="notice is-info">
    The JavaScript component will automatically map all ARIA attributes.
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
            <td>$input-class</td>
            <td>.custom-input</td>
            <td>CSS class name for the custom input wrapper.</td>
        </tr>
        <tr>
            <td>$input-class-checkbox</td>
            <td>.checkbox</td>
            <td>CSS class name for the custom checkbox.</td>
        </tr>
        <tr>
            <td>$input-class-radio</td>
            <td>.radio</td>
            <td>CSS class name for the custom radio.</td>
        </tr>
        <tr>
            <td>$input-class-select</td>
            <td>.select</td>
            <td>CSS class name for the custom select.</td>
        </tr>
        <tr>
            <td>$input-class-select-arrow</td>
            <td>.select-arrow</td>
            <td>CSS class name for the custom select arrow.</td>
        </tr>
        <tr>
            <td>$input-class-select-label</td>
            <td>.select-label</td>
            <td>CSS class name for the custom select label.</td>
        </tr>
        <tr>
            <td>$input-class-select-options</td>
            <td>.select-options</td>
            <td>CSS class name for the custom select options drop list.</td>
        </tr>
    </tbody>
</table>

## Options ##

Inherits all options from the [parent Component](component.md#options).

<table class="table is-striped data-table">
    <thead>
        <tr>
            <th>Option</th>
            <th>Type</th>
            <th>Default</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>copyClasses</td>
            <td>bool</td>
            <td>true</td>
            <td>
                Copy over classes from the original element to the custom element.
                Will not copy over <code>.input</code> classes.
            </td>
        </tr>
        <tr>
            <td>filterClasses</td>
            <td>regex</td>
            <td>/\binput\b/</td>
            <td>
                Filter out classes during the copy process using a regex pattern.
            </td>
        </tr>
        <tr>
            <td>template</td>
            <td>string</td>
            <td>
                &lt;div class="custom-input"&gt;&lt;/div&gt;
            </td>
            <td>The outer wrapping markup.</td>
        </tr>
        <tr class="table-divider">
            <td colspan="4">Input</td>
        </tr>
        <tr>
            <td>radio</td>
            <td>string</td>
            <td>input:radio</td>
            <td>CSS selector to find radios within the current element.</td>
        </tr>
        <tr>
            <td>checkbox</td>
            <td>string</td>
            <td>input:checkbox</td>
            <td>CSS selector to find checkboxes within the current element.</td>
        </tr>
        <tr>
            <td>select</td>
            <td>string</td>
            <td>select</td>
            <td>CSS selector to find selects within the current element.</td>
        </tr>
        <tr class="table-divider">
            <td colspan="4">InputCheckbox</td>
        </tr>
        <tr>
            <td>checkboxTemplate</td>
            <td>string</td>
            <td>
                &lt;label class="checkbox"&gt;&lt;/label&gt;
            </td>
            <td>The custom checkbox markup.</td>
        </tr>
        <tr class="table-divider">
            <td colspan="4">InputRadio</td>
        </tr>
        <tr>
            <td>radioTemplate</td>
            <td>string</td>
            <td>
                &lt;label class="radio"&gt;&lt;/label&gt;
            </td>
            <td>The custom radio markup.</td>
        </tr>
        <tr class="table-divider">
            <td colspan="4">InputSelect</td>
        </tr>
        <tr>
            <td>arrowTemplate</td>
            <td>string</td>
            <td>
                &lt;span class="caret-down"&gt;&lt;/span&gt;
            </td>
            <td>The markup to insert as the custom select arrow.</td>
        </tr>
        <tr>
            <td>countMessage</td>
            <td>string</td>
            <td>{count} of {total} selected</td>
            <td>The message to use when <code>multipleFormat</code> is set to <code>count</code>.</td>
        </tr>
        <tr>
            <td>descTemplate</td>
            <td>string</td>
            <td>
                &lt;span class="drop-desc"&gt;&lt;/span&gt;
            </td>
            <td>The item description markup.</td>
        </tr>
        <tr>
            <td>getDefaultLabel</td>
            <td>string</td>
            <td>title</td>
            <td>
                The select attribute to gather the default label from.
                The default label is used when no items are selected in multi-selects.
            </td>
        </tr>
        <tr>
            <td>getOptionLabel</td>
            <td>string</td>
            <td>title</td>
            <td>
                The option attribute to gather the custom label from.
                The option label will be used to populate the selected label with,
                in place of using the option content.
            </td>
        </tr>
        <tr>
            <td>getDescription</td>
            <td>string</td>
            <td>data-description</td>
            <td>
                The option attribute to gather the custom description from.
                The custom description will be inserted after the label within a custom dropdown.
            </td>
        </tr>
        <tr>
            <td>headingTemplate</td>
            <td>string</td>
            <td>
                &lt;li class="drop-heading"&gt;&lt;/li&gt;
            </td>
            <td>The heading markup for list items.</td>
        </tr>
        <tr>
            <td>hideFirst</td>
            <td>bool</td>
            <td>false</td>
            <td>Hide the first item in the menu.</td>
        </tr>
        <tr>
            <td>hideOpened</td>
            <td>bool</td>
            <td>true</td>
            <td>Hide all other opened select menus.</td>
        </tr>
        <tr>
            <td>hideSelected</td>
            <td>bool</td>
            <td>false</td>
            <td>Hide the selected item in the menu.</td>
        </tr>
        <tr>
            <td>listLimit</td>
            <td>int</td>
            <td>3</td>
            <td>The max limit of labels to display when <code>multipleFormat</code> is set to <code>list</code>.</td>
        </tr>
        <tr>
            <td>multipleFormat</td>
            <td>string</td>
            <td>count</td>
            <td>
                The label format for multi-selects, accepts count or list.
                Count will display a message similar to "1 of 10 selected",
                while list will list out the labels of the items selected.
            </td>
        </tr>
        <tr>
            <td>native</td>
            <td>bool</td>
            <td>Toolkit.isTouch</td>
            <td>Use native browser dropdowns instead of custom dropdowns.</td>
        </tr>
        <tr>
            <td>optionsTemplate</td>
            <td>string</td>
            <td>
                &lt;div class="drop drop--down select-options" data-select-options&gt;&lt;/div&gt;
            </td>
            <td>The options drop menu markup. The <code>data-select-options</code> is required. </td>
        </tr>
        <tr>
            <td>selectTemplate</td>
            <td>string</td>
            <td>
                &lt;div class="select" data-select&gt;<br>
                    &lt;div class="select-arrow" data-select-arrow&gt;&lt;/div&gt;<br>
                    &lt;div class="select-label" data-select-label&gt;&lt;/div&gt;<br>
                &lt;/div&gt;
            </td>
            <td>The custom select button markup. The <code>data-select-*</code> attributes are required. </td>
        </tr>
    </tbody>
</table>

## Events ##

Inherits all events from the [parent Component](component.md#events).

<table class="table is-striped data-table">
    <thead>
        <tr>
            <th>Event</td>
            <th>Arguments</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>change</td>
            <td>mixed:value, collection:selected</td>
            <td>
                Triggered when an option is selected in a custom select drop down.
                The 1st argument will be the result of <code>val()</code>,
                while the 2nd argument is a list of all select option elements.
            </td>
        </tr>
    </tbody>
</table>

## Properties ##

Inherits all properties from the [parent Component](component.md#properties).

<table class="table is-striped data-table">
    <thead>
        <tr>
            <th>Property</th>
            <th>Type</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>element</td>
            <td>element</td>
            <td>The custom input replacement.</td>
        </tr>
        <tr>
            <td>input</td>
            <td>element</td>
            <td>The select, checkbox, or radio element.</td>
        </tr>
        <tr>
            <td>wrapper</td>
            <td>element</td>
            <td>The custom input wrapper.</td>
        </tr>
        <tr class="table-divider">
            <td colspan="4">InputSelect</td>
        </tr>
        <tr>
            <td>dropdown</td>
            <td>element</td>
            <td>The custom dropdown (uses the Drop component).</td>
        </tr>
        <tr>
            <td>index</td>
            <td>int</td>
            <td>The current option index when cycling with keyboard events.</td>
        </tr>
        <tr>
            <td>multiple</td>
            <td>bool</td>
            <td>Is the current select element a multi-select.</td>
        </tr>
    </tbody>
</table>

## Methods ##

Inherits all methods from the [parent Component](component.md#methods).
