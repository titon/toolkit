# Component System #

The individual components that make up the Toolkit JavaScript layer are powered by a robust object-oriented class layer.
This base class that all components extend from can be found under the `Toolkit.Component` object.
The Component class provides common methods, properties, and events &mdash; all of which can be found in more detail below.

Before we learn more about the component system, we must differentiate between the two types of components.
Every type of component falls into one of the following.

* Activated
    * Component class is initialized on an element that actives the component.
    * Component element is created with JavaScript through a template option.
* Embedded
    * Component class is initialized on an existing element in the DOM.
    * Component element is the target element from the DOM.

And the components placed in their respective type.
Do note that it's possible for a component to share functionality from multiple types &mdash; TypeAhead for example.

* Activated: Blackout, Flyout, Modal, Popover, Showcase, Tooltip, TypeAhead
* Embedded: Accordion, Carousel, Drop, Input, LazyLoad, Mask, Matrix, OffCanvas, Pin, Stalker, Tabs, TypeAhead

## Templates ##

Templates are strings of HTML markup used for the creation of DOM elements, and are represented by the `template` option.
They are primarily used by activated components as the main element for interaction.

For example, the [Modal component](../../components/modal.md) uses the following template markup
to create the elements that are used in the page.

```javascript
{
    template: '<div class="modal">' +
        '<div class="modal-outer">' +
            '<div class="modal-inner"></div>' +
            '<button class="modal-close modal-hide"><span class="x"></span></button>' +
        '</div>' +
    '</div>'
}
```

Templates can be customized by overriding the `template` option.
When customizing however, it's important to associate the custom markup with class mappings.
To map where elements are found, the classes under the "Found With" properties table column should be used.
To map where events are bound, the classes under the "Bound To" methods table column should be used.
These tables can be found under the documentation for each component.

### Elements As Templates ###

It's also possible to use existing DOM elements as a template. This is especially useful for components
where each instance of the component should use the same DOM element &mdash; blackouts for example.
Providing an element ID for the `templateFrom` option will attempt to use that element as the template.

```javascript
{
    templateFrom: '#some-element'
}
```

We can also define a template using a script tag.

```html
<script type="text/html" id="some-element">
    <div class="modal">
        <div class="modal-inner"></div>
    </div>
</script>
```

If no element is found, the component will fall back to the `template` option.

## Options ##

Extensibility of components can be achieved through customizable options.
Each component has a different set of options, and these options can be used to alter functionality.

Options can be set globally by modifying the `options` object on the component class.
These options will need to be modified *before* a component is initialized.

```javascript
// Single option
Toolkit.Tooltip.options.position = 'top-right';

// Multiple options
$.extend(Toolkit.Tooltip.options, {
    position: 'top-right',
    follow: true,
    mouseThrottle: 75
});
```

Options can also be set on a per instance basis when initializing a component.
These options will inherit and override the global options.

```javascript
$('.js-tooltip').tooltip({
    position: 'top-right'
});
```

### Data Attribute Inheritance ##

At the highest level we have global options. At the middle level we have constructor options.
And at the lowest level, the element, we have data attribute options. Data attributes permit
individual elements to inherit custom options that override all other options.

Each data attribute must be defined in the format of `data-{component}-{option}="{value}"`.
The component and option names will be in all lowercase format.

Say we have 3 carousels on a page, but we want separate animations for each, and we only
want to initialize the component once. This can easily be solved through data attributes.

```html
<div class="carousel" data-carousel-animation="slide">
    ...
</div>

<div class="carousel" data-carousel-animation="slide-up">
    ...
</div>

<div class="carousel" data-carousel-animation="fade">
    ...
</div>
```

```javascript
$('.carousel').carousel();
```

The previous example is only possible for embedded components, since they only handle a single element.
On the other hand, activated components are initialized on a collection of elements,
so each individual node can define their own options that will inherit at runtime.

```html
<button type="button" class="js-tooltip" data-tooltip="A message!" data-tooltip-position="top-center">Top Centered</button>

<button type="button" class="js-tooltip" data-tooltip="/load/this" data-tooltip-ajax="true">AJAX</button>
```

```javascript
$('.js-tooltip').tooltip({
    position: 'top-left',
    ajax: false
});
```

### Responsive Options ###

For situations where component options need to change depending on the size of the device, the `responsive` option
can be used (this option can be used by *all* components). This option should define an object of settings,
with each setting having a `breakpoint` to compare against, and the custom options to override with.

For example, our carousel should have different item counts depending on device size.
The default options will apply to all devices not found in the breakpoints.

```javascript
$('.carousel').carousel({
    itemsToShow: 3,
    responsive: {
        tablet: {
            breakpoint: '(min-width: 768px) and (max-width: 1024px)',
            itemsToShow: 2
        },
        mobile: {
            breakpoint: '(max-width: 480px)',
            itemsToShow: 1
        }
    }
});
```

<div class="notice is-info">
    Breakpoint detection uses the built in <a href="https://developer.mozilla.org/en-US/docs/Web/API/Window.matchMedia">matchMedia()</a> function.
    All breakpoint definitions should follow the media query specification.
</div>

<div class="notice is-warning">
    Breakpoint detection only triggers on the initial page load, and will not trigger if you resize your browser
    manually by resizing the OS window.
</div>

<div class="notice is-error">
    The <code>matchMedia()</code> function is not available in IE9 and below, and will require a polyfill.
</div>

### Shared Options ###

The following options are shared between all components.

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
            <td>context</td>
            <td>element</td>
            <td></td>
            <td>The element to attach delegated events to, or to use as a parent. Defaults to the document body.</td>
        </tr>
        <tr>
            <td>cache</td>
            <td>bool</td>
            <td>true</td>
            <td>Whether to cache the response of AJAX requests.</td>
        </tr>
        <tr>
            <td>delegate</td>
            <td>string</td>
            <td></td>
            <td>The CSS selector to bind delegated events to. Is only required for activated components. (MooTools only)</td>
        </tr>
        <tr>
            <td>className</td>
            <td>string</td>
            <td></td>
            <td>Class name to append to the target element. Allows for custom styles.</td>
        </tr>
        <tr>
            <td>template</td>
            <td>string</td>
            <td></td>
            <td>The HTML used to create the component element. Is only used by activated components.</td>
        </tr>
        <tr>
            <td>templateFrom</td>
            <td>string</td>
            <td></td>
            <td>The ID of an element to use as the template.</td>
        </tr>
    </tbody>
</table>

## Events ##

Similar to native JavaScript events, the component layer has a system for dispatching callbacks at specific events.
The difference between native events and Toolkit events, is that Toolkit events are set as options through the constructor.
These events, dubbed "option events", can only be defined once and will be triggered for all elements in a collection.
Any option that begins with `on` and defines an anonymous function is considered an event, for example.

```javascript
$('.carousel').carousel({
    onInit: function() {
        // Do something
    }
});
```

<div class="notice is-info">
    The "this" context within option event handlers will be bound to the component object instance.
</div>

### Namespaced Events ###

If you're using jQuery, you have the option of attaching namespaced events to the element that was initialized by a component.
The difference between element events and option events (above) is the ability to define multiple handlers for element events,
and to define them outside of the component. Take the following for example.

```javascript
$('#tabs').tabs({
    onShow: function(tab) {
        this.element.addClass('foobar');
    }
});

$('#tabs').on('show.toolkit.tabs', function(e, tab) {
    e.context.element.addClass('foobar');
});
```

What we did was attach a namespaced event to the same element in the format of `{event}.toolkit.{component}`
(no "on" required in the event name). Now anytime a tab is clicked, the `onShow` option event will trigger,
and all `show.toolkit.tabs` event handlers will trigger.

<div class="notice is-info">
    The "this" context within element event handlers will be the respective element.
    The component object instance can be found under the <code>context</code> property in the event object.
</div>

### Shared Events ###

The following events are shared between all components.

<table class="table is-striped data-table">
    <thead>
        <tr>
            <th>Option Event</th>
            <th>Element Event</th>
            <th>Arguments</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>onInit</td>
            <td>init.toolkit.{component}</td>
            <td></td>
            <td>Triggered immediately after a component has initialized.</td>
        </tr>
        <tr>
            <td>onDestroy</td>
            <td>destroy.toolkit.{component}</td>
            <td></td>
            <td>Triggered immediately before a component is destroyed.</td>
        </tr>
        <tr>
            <td>onShow</td>
            <td>show.toolkit.{component}</td>
            <td></td>
            <td>
                Triggered when the component element is shown (this can change depending on context),
                and after an AJAX call has finished.
            </td>
        </tr>
        <tr>
            <td>onHide</td>
            <td>hide.toolkit.{component}</td>
            <td></td>
            <td>Triggered when the component element is hidden (this also depends on context).</td>
        </tr>
        <tr>
            <td>onLoad</td>
            <td>load.toolkit.{component}</td>
            <td>string:response</td>
            <td>
                Triggered after an AJAX call has finished, but before the response is rendered.
                Only triggers for HTML responses.
            </td>
        </tr>
        <tr>
            <td>onProcess</td>
            <td>process.toolkit.{component}</td>
            <td>mixed:response</td>
            <td>
                Triggered after an AJAX call has finished, and only if the response is non-HTML (JSON, XML, etc).
            </td>
        </tr>
    </tbody>
</table>

## Properties ##

The following properties are available on all class instances.

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
            <td>component</td>
            <td>string</td>
            <td>The name of the component. This should not be modified.</td>
        </tr>
        <tr>
            <td>version</td>
            <td>string</td>
            <td>The last version this component was updated. This should not be modified.</td>
        </tr>
        <tr>
            <td>uid</td>
            <td>int</td>
            <td>
                A unique identifier for the component instance.
                The value correlates to the number of instances in the page.
            </td>
        </tr>
        <tr>
            <td>enabled</td>
            <td>boolean</td>
            <td>
                Whether the instance is currently enabled or not.
                Disabled components will not trigger events or functionality.
                Can be toggled through <code>enable()</code> and <code>disable()</code> methods.
            </td>
        </tr>
        <tr>
            <td>element</td>
            <td>element</td>
            <td>
                The primary element used by the component.
                Is built from the <code>template</code> or <code>templateFrom</code> options,
                or is passed through the constructor.
            </td>
        </tr>
        <tr>
            <td>elements</td>
            <td>collection</td>
            <td>
                A collection of elements used by the component.
            </td>
        </tr>
        <tr>
            <td>node</td>
            <td>element</td>
            <td>
                The element that currently activated the component.
                Primarily used by activated components.
            </td>
        </tr>
        <tr>
            <td>nodes</td>
            <td>collection</td>
            <td>
                A collection of elements that are used for activating the component.
            </td>
        </tr>
        <tr>
            <td>options</td>
            <td>object</td>
            <td>Configurable options. More information can be found above.</td>
        </tr>
        <tr>
            <td>runtime</td>
            <td>object</td>
            <td>Options that are inherited at runtime dynamically per element through data attributes.</td>
        </tr>
    </tbody>
</table>

<div class="notice is-info">
    Additional properties are found within each component.
    Either read the source code or the individual documentation for a list of properties.
</div>

## Methods ##

The following methods are available on all class instances.

<table class="table is-striped data-table">
    <thead>
        <tr>
            <th>Method</th>
            <th>Vendor</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>createElement()</td>
            <td>Both</td>
            <td>
                Create an element from the <code>template</code> or <code>templateFrom</code> options.
                Will set class names on the element based on defined options.
            </td>
        </tr>
        <tr>
            <td>parseTemplate(string:template)</td>
            <td>MooTools</td>
            <td>Parse a template string into a set of DOM elements.</td>
        </tr>
        <tr>
            <td>setOptions(object:options[, element:inheritFrom])</td>
            <td>Both</td>
            <td>
                Set the options to use in the component.
                Will alter options based on current device and will inherit from data attributes if an element is passed.
            </td>
        </tr>
        <tr>
            <td>inheritOptions(object:options, element:element)</td>
            <td>Both</td>
            <td>Inherit and merge options from the target elements data attributes.</td>
        </tr>
        <tr>
            <td>bindEvents(string:type)</td>
            <td>Both</td>
            <td>Add or remove events for elements found in the <code>events</code> object mapping.</td>
        </tr>
        <tr>
            <td>enable()</td>
            <td>Both</td>
            <td>Enable the component and bind events.</td>
        </tr>
        <tr>
            <td>disable()</td>
            <td>Both</td>
            <td>Disable the component and unbind events.</td>
        </tr>
        <tr>
            <td>destroy()</td>
            <td>Both</td>
            <td>Disable the component, unbind events, remove elements, and delete the instance.</td>
        </tr>
        <tr>
            <td>fireEvent(string:event[, array:args])</td>
            <td>Both</td>
            <td>Trigger an event with optional arguments to pass. Will find an event within the options object.</td>
        </tr>
        <tr>
            <td>readOption(element:element, string:key)</td>
            <td>Both</td>
            <td>Read an option from an elements data attribute, else fallback to the original option.</td>
        </tr>
        <tr>
            <td>readValue(element:element, mixed:query)</td>
            <td>Both</td>
            <td>
                Extract a value from an element using a defined query.
                The query may be an element property, attribute, or function callback.
            </td>
        </tr>
        <tr>
            <td>requestData(object:options[, func:before[, func:done[, func:fail]]])</td>
            <td>Both</td>
            <td>
                Requests data from a URL using an AJAX call.
                Will automatically prepare an XHR object and inherit settings from <code>options.ajax</code>.
                The first argument can either be a URL, or an object of AJAX options.
                The <code>before</code>, <code>done</code>, and <code>fail</code> arguments can be set to override the default callbacks.
            </td>
        </tr>
        <tr>
            <td>process(mixed:response)</td>
            <td>Both</td>
            <td>
                Handles non-HTML AJAX responses.
                If the response is JSON and a <code>callback</code> property exists,
                the function defined will be triggered (JSONP style).
            </td>
        </tr>
        <tr>
            <td>position(string:response)</td>
            <td>Both</td>
            <td>Handles HTML AJAX responses. Will re-position the element.</td>
        </tr>
        <tr>
            <td>show([element:node])</td>
            <td>Both</td>
            <td>Show the element and set an optional activating node.</td>
        </tr>
        <tr>
            <td>hide([func:callback])</td>
            <td>Both</td>
            <td>Hide the element and trigger an optional callback function.</td>
        </tr>
        <tr>
            <td>id([string:...args])</td>
            <td>Both</td>
            <td>Generate a unique CSS class name using the components name, UID, and defined arguments.</td>
        </tr>
    </tbody>
</table>

<div class="notice is-warning">
    Method availability, functionality, and argument ordering may differ between the jQuery and MooTools versions.
</div>
