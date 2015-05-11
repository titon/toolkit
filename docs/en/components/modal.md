# Modal #

An informational window displayed above content and utilized for workflow interactions.

## Usage ##

The modal component must be initialized on an element that will trigger the display of the modals, for example.

```html
<a href="/categories/add" class="js-modal" id="add-category">Add Category</a>
```

```javascript
$('.js-modal').modal();
```

The value of the `getContent` option (falls back to `href` attribute) determines the URL to request for modal content. Once a request completes, the AJAX response will be inserted into the `data-modal-content` element.

To insert non-AJAX content into a modal, the `getContent` value can point to an ID in the page, like so `#some-id`. We can also set the content directly through the modal instance.

```javascript
$('.js-modal').toolkit('modal', 'show', [$('#add-category'), 'This will be inserted into the modal.']);
```

Or we can trigger the modal by passing in the node to read from.

```javascript
$('.js-modal').toolkit('modal', 'show', $('#add-category')); // Loads /categories/add
```

### Dynamic Content Loading ###

Briefly mentioned above, modals use a form of dynamic content loading. This allows the body of the modal to be loaded dynamically from multiple sources, either from an AJAX request, an element, or a literal value.

* [Learn more about dynamic content loading.](../development/js/usage.md#dynamic-content-loading)

### Multiple Modals ###

Displaying multiple modals at the same time is possible, but will require multiple modal instances.

```javascript
$('.js-modal-1').modal();
$('.js-modal-2').modal();
```

Activating the modal uses event delegation, so placing `.js-modal-1` and `.js-modal-2` anywhere will open it. This even applies to elements loaded in via AJAX, like within the body of another modal.

### Form Submitting ###

How useful would a modal be if it didn't support forms? Rather useless. Using forms in modals is rather simple, simply place the `form` tag and a `data-modal-submit` attribute on the element that should trigger form submission.

```html
<form action="/url/to/post/to" method="post">
    ...

    <button type="button" data-modal-submit>Submit</button>
</form>
```

Once submitted, the `action` and `method` from the `form` tag will be used as the URL to submit to. If the AJAX response is HTML, then the response will replace the content in the current modal. If the AJAX response is non-HTML, then continue reading.

<div class="notice is-info">
    File uploading is possible through modal forms if the browser supports the <code>FormData</code> API. This is automatically detected and enabled.
</div>

<div class="notice is-error">
    Do not use normal submit buttons within a modal form, use <code>[data-modal-submit]</code> instead.
</div>

### Non-HTML Responses ###

If an AJAX request returns a non-HTML response, say JSON or XML, the modal will not be shown. Instead of `position()` being called on the instance, `process()` will be called, which will fire the `process` event.

The `process()` method can also trigger a callback automatically if the response is JSON. Simply return an index in the JSON response with the key `callback` and the value the name of the function to call. For example, if the JSON response was.

```json
{"callback":"console.log","data":{}}
```

Then the `console.log` function will be triggered with the response passed as the 1st argument.

### Notes ###

* The `animation` option will be appended as a class name.
* An `.is-fullscreen` class will be added to the modal when `fullScreen` is enabled.
* File uploading is enabled if the [browser supports](http://caniuse.com/#feat=xhr2) the `FormData` API.

## ARIA ##

The `dialog` role and the appropriate `aria-*` attributes are required when supporting ARIA. [Learn more about this role.](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_dialog_role)

All required ARIA attributes will be automatically added to the component when initialized, which will generate the following markup.

```html
<div class="modal" role="dialog" aria-labelledby="toolkit-modal-1-title" aria-describedby="toolkit-modal-1-content">
    ...
</div>
```

The only requirement for fully supporting ARIA is adding the appropriate IDs to the content being inserted into the modal. We would need to add `toolkit-modal-#-title` and `toolkit-modal-#-content`, where `#` represents the modal unique ID.

```html
<div class="modal-head" id="toolkit-modal-1-title">
    ...
</div>

<div class="modal-body" id="toolkit-modal-1-content">
    ...
</div>
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
            <td>$modal-animations</td>
            <td>("fade", "from-above", "from-below", "slide-in-top", "slide-in-right", "slide-in-bottom", "slide-in-left")</td>
            <td>A list of all animations to include in the CSS output.</td>
        </tr>
        <tr>
            <td>$modal-class</td>
            <td>.modal</td>
            <td>CSS class name for the modal wrapper.</td>
        </tr>
        <tr>
            <td>$modal-class-outer</td>
            <td>.modal-outer</td>
            <td>CSS class name for the outer modal element.</td>
        </tr>
        <tr>
            <td>$modal-class-inner</td>
            <td>.modal-inner</td>
            <td>CSS class name for the inner modal element.</td>
        </tr>
        <tr>
            <td>$modal-class-head</td>
            <td>.modal-head</td>
            <td>CSS class name for the modal header element.</td>
        </tr>
        <tr>
            <td>$modal-class-body</td>
            <td>.modal-body</td>
            <td>CSS class name for the modal body element.</td>
        </tr>
        <tr>
            <td>$modal-class-foot</td>
            <td>.modal-foot</td>
            <td>CSS class name for the modal footer element.</td>
        </tr>
        <tr>
            <td>$modal-mobile-breakpoint</td>
            <td>640px</td>
            <td>The break point to apply mobile widths.</td>
        </tr>
        <tr>
            <td>$modal-transition</td>
            <td>.3s</td>
            <td>The transition time for all modal animations.</td>
        </tr>
        <tr>
            <td>$modal-zindex</td>
            <td>610</td>
            <td>The z-index for the modal element.</td>
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
            <td>fade</td>
            <td>
                The animation to use when displaying the modal.
                Available options are: fade, from-above, from-below,
                slide-in-top, slide-in-right, slide-in-bottom, slide-in-left.
            </td>
        </tr>
        <tr>
            <td>blackout</td>
            <td>bool</td>
            <td>true</td>
            <td>Whether to display a blackout when a modal is open.</td>
        </tr>
        <tr>
            <td>clickout</td>
            <td>bool</td>
            <td>true</td>
            <td>Whether to hide the modal when the blackout is clicked.</td>
        </tr>
        <tr>
            <td>fullScreen</td>
            <td>bool</td>
            <td>false</td>
            <td>Whether to resize the modal to fullscreen and cover the viewport.</td>
        </tr>
        <tr>
            <td>getContent</td>
            <td>string|function</td>
            <td>data-modal</td>
            <td>
                If a string is passed, fetch the URL from the HTML attribute.
                If a string is passed in #id format, fetch the content from the HTML of the element.
                If a function is passed, use the return value as the URL.
                If no value is found, will fallback to <code>href</code> attribute for URL.
                The URL will be requested via AJAX for the content.
            </td>
        </tr>
        <tr>
            <td>stopScroll</td>
            <td>bool</td>
            <td>true</td>
            <td>
                Whether to remove the scrollbar on the window while the modal is open.
                Requires <code>html.touch</code> for mobile devices to function properly.
            </td>
        </tr>
        <tr>
            <td>template</td>
            <td>string</td>
            <td>
                &lt;div class="modal"&gt;<br>
                    &lt;div class="modal-outer"&gt;<br>
                        &lt;div class="modal-inner" data-modal-content&gt;&lt;/div&gt;<br>
                        &lt;button class="modal-close" data-modal-close&gt;&lt;span class="x"&gt;&lt;/span&gt;&lt;/button&gt;<br>
                    &lt;/div&gt;<br>
                &lt;/div&gt;
            </td>
            <td>The modal markup. The <code>data-modal-*</code> attributes are required.</td>
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
            <td>submit</td>
            <td>element:form</td>
            <td>Triggered after a form submit has been clicked but before the AJAX request is posted.</td>
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
            <td>blackout</td>
            <td>object</td>
            <td>The <code>Toolkit.Blackout</code> instance when <code>blackout</code> is enabled.</td>
        </tr>
        <tr>
            <td>cache</td>
            <td>object</td>
            <td>Collection of cached AJAX requests indexed by URL.</td>
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
            <td>hide()</td>
            <td>Hide the modal.</td>
            <td>[data-modal-close]</td>
        </tr>
        <tr>
            <td>show([element:node[, string:content]])</td>
            <td>
                Display the modal. If a node is passed, extract the URL to request, or the content to use.
                If the content argument is passed, use that as the content.
            </td>
            <td><code>selector</code></td>
        </tr>
        <tr>
            <td>submit()</td>
            <td>Submit a form found within the modal using an AJAX call.</td>
            <td>[data-modal-submit]</td>
        </tr>
    </tbody>
</table>
