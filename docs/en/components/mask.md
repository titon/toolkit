# Mask #

Conceal an element by masking its content with a transparent overlay.

## Usage ##

A mask can be used for in-between loading states, like waiting for an AJAX request, to conceal the contents of an element. The mask element is appended and positioned absolutely within the target.

The mask component must be initialized on the element, the target, that we want to conceal.

```javascript
$('.js-mask-target').mask();
```

The mask will not be shown until `show()` or `toggle()` is called on the mask object. The mask object can be retrieved by calling `toolkit('mask')` on the target collection.

```javascript
$('.js-mask-target').toolkit('mask', 'toggle');
```

<div class="notice is-info">
    Applying a mask to <code>body</code> will cover the entire viewport.
</div>

<div class="notice is-warning">
    Target elements will be styled with overflow <code>hidden</code> and position <code>relative</code>.
</div>

### Custom Masks ###

If we want to customize the markup found within a mask, we can manually place the mask element within the target. This custom mask will be used instead of creating a new mask.

```html
<div class="article js-mask-target">
    ...

    <div class="mask hide" data-mask>
        <div class="mask-message" data-mask-message">
            <!-- Custom markup -->
        </div>
    </div>
</div>
```

<div class="notice is-info">
    The <code>data-mask-*</code> attributes are required so that the JavaScript layer can find or bind elements in the DOM.
</div>

### Automatic Toggling ###

Instead of toggling the display manually through the mask object, we can bind a click event to a button or element that triggers the toggle by defining the `selector` option.

```javascript
$('.js-mask-target').mask({
    selector: '.js-mask-toggle'
});
```

### Notes ###

* Target elements will have a `.is-maskable` class applied.
* Target elements will also have `.is-masked` applied when the mask is activated.

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
            <td>$mask-class</td>
            <td>.mask</td>
            <td>CSS class name for the mask element.</td>
        </tr>
        <tr>
            <td>$mask-class-message</td>
            <td>.mask-message</td>
            <td>CSS class name for the mask message.</td>
        </tr>
        <tr>
            <td>$mask-class-target</td>
            <td>.is-maskable</td>
            <td>CSS class name for the mask target.</td>
        </tr>
        <tr>
            <td>$mask-opacity</td>
            <td>0.85</td>
            <td>The alpha transparency for the masking element.</td>
        </tr>
        <tr>
            <td>$mask-transition</td>
            <td>.3s</td>
            <td>The transition time for fading in and out.</td>
        </tr>
        <tr>
            <td>$mask-zindex</td>
            <td>500</td>
            <td>The z-index for the mask element.</td>
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
            <td>messageTemplate</td>
            <td>string</td>
            <td>
                &lt;div class="mask-message" data-mask-message&gt;&lt;/div&gt;
            </td>
            <td>The loading message markup. The <code>data-mask-message</code> is required.</td>
        </tr>
        <tr>
            <td>messageContent</td>
            <td>string</td>
            <td></td>
            <td>The content to use as the message that appears in the center of the mask.</td>
        </tr>
        <tr>
            <td>revealOnClick</td>
            <td>bool</td>
            <td>false</td>
            <td>Reveal the content and remove the mask when the mask is clicked.</td>
        </tr>
        <tr>
            <td>template</td>
            <td>string</td>
            <td>
                &lt;div class="mask" data-mask&gt;&lt;/div&gt;
            </td>
            <td>The mask markup. The <code>data-mask</code> is required.</td>
        </tr>
    </tbody>
</table>

## Events ##

Inherits all events from the [parent Component](component.md#events).

## Properties ##

Inherits all properties from the [parent Component](component.md#properties).

<table class="table is-striped data-table">
    <thead>
        <tr>
            <th>Property</th>
            <th>Type</th>
            <th>Description</th>
            <th>Found With</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>mask</td>
            <td>element</td>
            <td>The mask element that covers the target element. Can be found as a child within the target element.</td>
            <td>[data-mask]</td>
        </tr>
        <tr>
            <td>message</td>
            <td>element</td>
            <td>The message element found within the center of the mask element.</td>
            <td>[data-mask-message]</td>
        </tr>
    </tbody>
</table>

## Methods ##

Inherits all methods from the [parent Component](component.md#methods).

<table class="table is-striped data-table">
    <thead>
        <tr>
            <th>Method</th>
            <th>Description</th>
            <th>Bound To</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>toggle()</td>
            <td>Toggle the display of the mask.</td>
            <td><code>selector</code> option</td>
        </tr>
    </tbody>
</table>
