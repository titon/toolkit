# Toast #

Provides feedback about an operation through a timed popup.

## Usage ##

Toasts are an excellent way of providing feedback, or grabbing a users attention, for operations or actions that they have committed on the website. Toasts are also optional, and will disappear after a duration as to not interrupt their browsing experience.

To begin, a toast container needs to be initialized on the `body`.

```javascript
$('body').toast();
```

Now that the container exists, we need to populate it with actual toasts. Since toasts represent actions, they cannot be automated and will need to be created manually.

### Creating Toasts ###

Trigger the `create()` method on the toast instance to create a toast. This will display a popup within the container for a timed duration.

```javascript
$('body').toolkit('toast', 'create', 'This will be the toast message!');

// Equivalent to
$('body').toolkit('toast').create('This will be the toast message!');
```

<div class="notice is-info">
    HTML can also be passed as the content, allowing for very complex and unique toasts to be displayed.
</div>

### Dismissable Toasts ###

For situations where a toast needs to be displayed permanently until dismissed, an object of options can be passed as the 2nd argument to `create()` that disables the duration. A click event will also need to be bound to the toast to remove it.

```javascript
// Grab the toast instance
var toast = $('body').toolkit('toast');

// Create a link and set a callback to remove the toast when clicked
var link = $('<a/>')
    .html('This is an important message!')
    .click(function() {
        toast.hide(this.parentNode); // Argument passed must be a .toast element
    });

// Create the toast
toast.create(link, { duration: 0 });
```

## ARIA ##

The `log` role on the container, and the `note` role on the toast, and the appropriate `aria-*` attributes are required when supporting ARIA.

```html
<aside class="toasts" role="log">
    <div class="toast" role="note">
        ...
    </div>
</aside>
```

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
            <td>$toast-animations</td>
            <td>("fade", "slide-up", "slide-down", "slide-left", "slide-right")</td>
            <td>A list of all animations to include in the CSS output.</td>
        </tr>
        <tr>
            <td>$toast-class</td>
            <td>.toast</td>
            <td>CSS class name for the toast element.</td>
        </tr>
        <tr>
            <td>$toast-class-wrapper</td>
            <td>.toasts</td>
            <td>CSS class name for the toasts wrapper.</td>
        </tr>
        <tr>
            <td>$toast-position</td>
            <td>("top-left", "top-center", "top-right", "center-left", "center-right", "bottom-left", "bottom-center", "bottom-right")</td>
            <td>A list of all positions to include in the CSS output.</td>
        </tr>
        <tr>
            <td>$toast-transition</td>
            <td>.3s</td>
            <td>The transition time for toast reveal animations.</td>
        </tr>
        <tr>
            <td>$toast-zindex</td>
            <td>500</td>
            <td>The z-index for the toasts container.</td>
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
            <td>animation</td>
            <td>string</td>
            <td>slide-up</td>
            <td>
                The animation to use when toasts are added to the container.
                Available options are: fade, slide-up, slide-down, slide-left, slide-right.
            </td>
        </tr>
        <tr>
            <td>duration</td>
            <td>int</td>
            <td>5000</td>
            <td>The number in milliseconds before a toast disappears.</td>
        </tr>
        <tr>
            <td>position</td>
            <td>string</td>
            <td>bottom-left</td>
            <td>
                Where to position the toasts container. Available options are:
                top-left, top-center, top-right, center-left, center-right, bottom-left, bottom-center, bottom-right.
            </td>
        </tr>
        <tr>
            <td>template</td>
            <td>string</td>
            <td>
                &lt;div class="toast"&gt;&lt;/div&gt;
            </td>
            <td>The toast markup.</td>
        </tr>
        <tr>
            <td>wrapperClass</td>
            <td>string</td>
            <td>toasts</td>
            <td>The class name to set on the composite wrapper.</td>
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
            <td>create</td>
            <td>element:toast</td>
            <td>Triggered after a toast is created but before it is shown.</td>
        </tr>
        <tr>
            <td>hiding</td>
            <td>element:toast</td>
            <td>Triggered before a toast is hidden.</td>
        </tr>
        <tr>
            <td>hidden</td>
            <td></td>
            <td>Triggered after a toast is hidden.</td>
        </tr>
        <tr>
            <td>showing</td>
            <td>element:toast</td>
            <td>Triggered before a toast is shown.</td>
        </tr>
        <tr>
            <td>shown</td>
            <td>element:toast</td>
            <td>Triggered after a toast is shown.</td>
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
            <td>The container element that all toasts are prepended to. It is fixed within the body.</td>
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
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>create(mixed:content[, object:options])</td>
            <td>
                Creates a toast, sets the HTML to content, and initializes timers.
                Options can be customized by passing a second argument.
            </td>
        </tr>
        <tr>
            <td>hide(element:toast)</td>
            <td>
                Hides the toast and sets an event that removes the element after the transition is complete.
                Is called automatically once the duration is over.
            </td>
        </tr>
        <tr>
            <td>show(element:toast)</td>
            <td>
                Reveal the toast within the container.
                Is called automatically after the toast is created.
            </td>
        </tr>
    </tbody>
</table>
