# JavaScript #

The ins and outs of the JavaScript layer within Toolkit.

* [Using Components](#using-components)
* [Accessing Components](#accessing-components)
* [Conflict Resolution](#conflict-resolution)
* [Toolkit Namespace](#toolkit-namespace)
    * [Vendor Prefix](#vendor-prefix)
    * [ARIA Support](#aria-Support)
    * [Global Options](#global-options)
    * [Locale Messages](#locale-messages)
    * [Feature Flags](#feature-flags)
* [Component System](#component-system)
    * [Templates](#templates)
        * [Elements As Templates](#elements-as-templates)
    * [Options](#options)
        * [Data Attribute Inheritance](#data-attribute-inheritance)
        * [Shared Options](#shared-options)
    * [Events](#events)
        * [Namespaced Events](#namespaced-events)
        * [Shared Events](#shared-events)
    * [Properties](#properties)
    * [Methods](#methods)
* [Extensions](#extensions)
* [Conventions](#conventions)

## Using Components ##

Using Toolkit components is extremely simple. If you're familiar with jQuery plugins, it's even simpler.
A component can be initialized with a single line of code.

```javascript
$('.tabs').tabs();
```

What this does is initialize a tabs component on the `.tabs` element(s). Easy!

## Accessing Components ##

To trigger methods, or access properties on a component, the class instance will need to be retrieved.
This can be achieved through the `toolkit()` method or jQuery's `data()` method.
The difference between the 2 methods, is that `toolkit()` will return an array of instances for every element
in the collection (unless it's a single element), while `data()` will return a single instance for the first
element in the collection. For example, take the following markup.

```html
<div class="tabs" id="tabs-1">
    ...
</div>

<div class="tabs" id="tabs-2">
    ...
</div>
```

And the results of each method call.

```javascript
$('.tabs').toolkit('tabs'); // array of 2 tab instances
$('#tabs-1').toolkit('tabs'); // 1 tab instance for #tabs-1

$('.tabs').data('toolkit.tabs'); // 1 tab instance for #tabs-1 (first in the collection)
$('#tabs-2').data('toolkit.tabs'); // 1 tab instance for #tabs-2
```

Once we have an instance, methods or properties on the instance can be accessed.
Each component will have different methods and properties, so check out their individual documentation.

```javascript
$.each($('.tabs').toolkit('tabs'), function(i, tabs) {
    tabs.hide();
});

$('#tabs-1').toolkit('tabs').sections; // collection of section elements
```

## Conflict Resolution ##

Toolkit has no concept of `noConflict()` that is found in other libraries.
Instead it has an automatic conflict resolution, where methods are renamed if one already exists.
For example, when using the tooltip component under the name `tooltip()`,
and that name is already taken (by jQuery UI for example), the method is renamed to `toolkitTooltip()`.

```javascript
$('.js-tooltip').tooltip();

// Automatically becomes
$('.js-tooltip').toolkitTooltip();
```

If for any reason the Toolkit method is lost, or overridden by another library,
components can be instantiated manually outside of the jQuery or MooTools syntax.

```javascript
new Toolkit.Tooltip($('.js-tooltip'), {});

// jQuery equivalent
$('.js-tooltip').tooltip({});
```

## Toolkit Namespace ##

The global `Toolkit` object found on the `window` object is used extensively by and created for the component system.
It defines global options, localized messages, feature detection, and device support.
It also acts as a namespace for components by housing a top level name to avoid global conflicts.
Each component class definition can be found on the `Toolkit` object, for example,
the accordion interface is found under `Toolkit.Accordion`.

### Vendor Prefix ###

Paired with the [Sass `$vendor-prefix` variable](sass.md#variables), the `Toolkit.vendor` can be defined for
prefixing within the JavaScript layer. This value will be prepended to all component class names that are
automatically created with JavaScript.

```javascript
Toolkit.vendor = 'tk-';
```

### ARIA Support ###

[ARIA](http://www.w3.org/TR/wai-aria/) is enabled by default for all applicable components.
What this involves is automatic ARIA attribute inclusion and generation for JavaScript modules.
To disable ARIA support, set the `Toolkit.aria` property to false.

```javascript
Toolkit.aria = false;
```

<div class="notice is-warning">
    Disabling ARIA also disables the <code>aria()</code> method.
</div>

### Locale Messages ###

The following messages are used within AJAX calls and are found under `Toolkit.messages`.
They are represented as an object allowing for easy localization, and can be modified similar to an options object.

<table class="table is-striped data-table">
    <thead>
        <tr>
            <th>Message</th>
            <th>Default</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>loading</td>
            <td>Loading...</td>
            <td>Message to display while an AJAX request is loading.</td>
        </tr>
        <tr>
            <td>error</td>
            <td>An error has occurred!</td>
            <td>Message to display when an AJAX call has failed.</td>
        </tr>
    </tbody>
</table>

```javascript
$.extend(Toolkit.messages, {
    loading: 'Wait a second!',
    error: 'Oops, it broke...'
});
```

### Feature Flags ###

The following flags are used for feature detection within components.
Each flag can be found on the `Toolkit` object.

<table class="table is-striped data-table">
    <thead>
        <tr>
            <th>Flag</th>
            <th>Vendor</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>hasTransition</td>
            <td>Both</td>
            <td>Does the browser support CSS transitions?</td>
        </tr>
        <tr>
            <td>isTouch</td>
            <td>Both</td>
            <td>Does the device support touch capabilities?</td>
        </tr>
        <tr>
            <td>isRetina</td>
            <td>Both</td>
            <td>Does the device support HD / retina displays?</td>
        </tr>
    </tbody>
</table>

```javascript
if (Toolkit.isTouch) {
    element.on('swipeleft', callback);
}
```

<div class="notice is-warning">
    Flags are determined automatically and should not be altered in any way!
</div>

## Component System ##

The individual components that make up the Toolkit JavaScript layer are powered by a robust object-oriented class layer.
This base class that all components extend can be found under the `Toolkit.Component` object.
The Component class provides common methods, properties, and events &mdash; all of which can be found in more detail below.

Before we learn more about the component system, we must differentiate between the two types of components.
Every type of component falls into one of the following.

* Activated
    * Component class is initialized on an element that actives the component.
    * Component element is created with JavaScript (can be customized through options).
* Embedded
    * Component class is initialized on an existing element in the DOM.
    * Component element is the target element from the DOM.

And the components placed in their respective type.
Do note that it's possible for a component to share functionality from multiple types &mdash; TypeAhead for example.

* Activated: Blackout, Flyout, Modal, Popover, Showcase, Tooltip, TypeAhead
* Embedded: Accordion, Carousel, Drop, Input, LazyLoad, Mask, Matrix, Pin, Stalker, Tabs, TypeAhead

### Templates ###

Templates are strings of HTML markup used for the creation of DOM elements, and are represented by the `template` option.
They are primarily used by activated components as the main element for interaction.

For example, the Modal component uses the following template markup to create the elements that are used in the page.

```javascript
{
    template: '<div class="modal">' +
        '<div class="modal-outer">' +
            '<div class="modal-handle">' +
                '<div class="modal-inner"></div>' +
                '<button type="button" class="modal-close modal-event-close"><span class="x"></span></button>' +
            '</div>' +
        '</div>' +
    '</div>'
}
```

Templates can be customized by overriding the `template` option.
When customizing however, it's important to associate the custom markup with class mappings.
These mappings tell the component layer where critical elements within the template can be found.

Continuing with the Modal example, the component must have knowledge of where to inset content into the modal.
This is handled by the `contentElement` option, which is set to `.modal-inner` by default.
Options that end with `Element` are used for template mapping.

And for a more concrete, albeit simple, example of customizing.

```javascript
$('.js-modal').modal({
    contentElement: '.modal-body',
    template: '<div class="modal">' +
        '<div class="modal-body"></div>' +
    '</div>'
});
```

<div class="notice is-info">
    Every component that supports templates will have different option mappings and requirements.
    Jump to the individual component documentation for more information.
</div>

#### Elements As Templates ####

It's also possible to use existing DOM elements as a template.
This is especially useful for components where each instance of the component should use the same DOM element &mdash; blackouts for example.
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
        <div class="modal-body"></div>
    </div>
</script>
```

If no element is found, the component will fall back to the `template` option.

### Options ###

Extensibility of components can be achieved through customizable options.
Each component has a different set of options, and these options can be used to toggle functionality.

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

#### Data Attribute Inheritance ###

At the highest level we have global options. At the middle level we have component options.
And at the lowest level, the element, we have data attribute options. Data attributes permit
individual elements to inherit custom options that override the component options.

Each data attribute must be defined in the format of `data-{component}-{option}="{value}"`.
The component name will be all lowercase in dashed format, while the option will be all lowercase.

Say we have 3 carousels on a page, but we want separate animations for each, and we only
want to execute the component once. This can easily be solved through data attributes.

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

#### Shared Options ####

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

### Events ###

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

#### Namespaced Events ####

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

#### Shared Events ####

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

### Properties ###

The following properties are available on all class instances, but not all components make use of them.

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
            <td>
                The name of the component. This should not be modified.
            </td>
        </tr>
        <tr>
            <td>version</td>
            <td>string</td>
            <td>
                The last version this component was updated. This should not be modified.
            </td>
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
            <td>
                Configurable options. More information can be found above.
            </td>
        </tr>
    </tbody>
</table>

Additional properties are found within each component.
Either read the source code or the individual documentation for a list of properties.

### Methods ###

The following methods are available on all class instances, but not all components make use of them.

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

## Extensions ##

Why stop at components? Why not extend jQuery and MooTools directly with new functionality?
Well don't worry, that's exactly what Toolkit has done.
We extended the prototype of each vendor with new functionality that eased component development.
These extensions may even solve a problem in your own codebase.

<table class="table is-striped data-table">
    <thead>
        <tr>
            <th>Extension</th>
            <th>Vendor</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr class="table-divider">
            <td colspan="3">Methods</td>
        </tr>
        <tr>
            <td>toolkit(string:component)</td>
            <td>Both</td>
            <td>
                Return an instance of a component if one has been bound on this element.
                If an array of elements is queried, an array of component instances will be returned.
            </td>
        </tr>
        <tr>
            <td>reveal()</td>
            <td>Both</td>
            <td>
                Show an element by replacing <code>.hide</code> with <code>.show</code>.
                Will trigger any animations or transitions.
            </td>
        </tr>
        <tr>
            <td>conceal()</td>
            <td>Both</td>
            <td>
                Hide an element by replacing <code>.show</code> with <code>.hide</code>.
                Will trigger any animations or transitions.
            </td>
        </tr>
        <tr>
            <td>positionTo(string:position, element|event:relativeTo[, object:baseOffset[, bool:isMouse]])</td>
            <td>Both</td>
            <td>
                Position the element relative to another element.
                <code>position</code> may be any combination of top, bottom, left, right, and center, in dashed format.
                <code>relativeTo</code> may either be an element or event (used with <code>isMouse</code> for mouse following).
                <code>baseOffset</code> may be an object with default left and top values.
                When set to true, <code>isMouse</code> will re-position the element based on mouse cursor dimensions.
                If the element falls outside of the viewport, it will be re-positioned by altering the position class name.
            </td>
        </tr>
        <tr>
            <td>is(':shown')</td>
            <td>jQuery</td>
            <td rowspan="2">
                Determines whether an element is visible or not by checking that <code>visibility</code> is not equal to hidden.
                Is used in conjunction with <code>conceal()</code> and <code>reveal()</code> for animating.
            </td>
        </tr>
        <tr>
            <td>isShown()</td>
            <td>MooTools</td>
        </tr>
        <tr>
            <td>i(int:index)<br> item(int:index)</td>
            <td>jQuery</td>
            <td>
                Return a jQuery wrapped value from the current jQuery collection defined by the index number.
                This is equivalent to <code>$($('.query')[0])</code> or <code>$($('.query').get(0))</code>.
            </td>
        </tr>
        <tr>
            <td>addData(string:key, mixed:value)</td>
            <td>jQuery</td>
            <td>
                Set data if the key does not exist, else return the current value.
                This is a combination of getting and setting internal jQuery data.
            </td>
        </tr>
        <tr>
            <td>aria(string:key, mixed:value)</td>
            <td>Both</td>
            <td>
                Sets ARIA attributes on the target element.
                Can also accept an object of key value pairs.
            </td>
        </tr>

        <tr class="table-divider">
            <td colspan="3">Functions</td>
        </tr>
        <tr>
            <td>jQuery.debounce(func:func[, int:threshold[, bool:immediate]])</td>
            <td>jQuery</td>
            <td rowspan="2">
                Delays the execution of a function until the duration has completed.
            </td>
        </tr>
        <tr>
            <td>Function.prototype.debounce([int:threshold[, bool:immediate]])</td>
            <td>MooTools</td>
        </tr>
        <tr>
            <td>jQuery.throttle(func:func[, int:delay[, array:args]])</td>
            <td>jQuery</td>
            <td>
                Throttle the execution of a function so it triggers at every delay interval.
            </td>
        </tr>
        <tr>
            <td>jQuery.bound(int:value, int:max[, int:min])</td>
            <td>jQuery</td>
            <td rowspan="2">Bound a number between a min and max range.</td>
        </tr>
        <tr>
            <td>Number.prototype.bound(int:value, int:max[, int:min])</td>
            <td>MooTools</td>
        </tr>
        <tr>
            <td>jQuery.cookie(string:key, mixed:value[, object:options])</td>
            <td>jQuery</td>
            <td>Set a cookie with a value. Can define optional settings.</td>
        </tr>
        <tr>
            <td>jQuery.removeCookie(string:key[, object:options])</td>
            <td>jQuery</td>
            <td>Remove a cookie defined by key.</td>
        </tr>
        <tr>
            <td>Array.prototype.chunk(int:size)</td>
            <td>MooTools</td>
            <td>
                Split an array into multiple chunked arrays.
            </td>
        </tr>
        <tr>
            <td>Function.prototype.bind(func:func)</td>
            <td>jQuery</td>
            <td>
                Alters the <code>this</code> context of bound functions.
                A polyfill for ECMA5 functionality.
            </td>
        </tr>

        <tr class="table-divider">
            <td colspan="3">Events</td>
        </tr>
        <tr>
            <td>clickout</td>
            <td>Both</td>
            <td>
                A custom event that triggers when a click occurs outside the element that has been bound.
                Is used by drop downs, dialogs, modals, etc.
            </td>
        </tr>
        <tr>
            <td>swipe, swipeleft, swiperight, swipeup, swipedown</td>
            <td>jQuery</td>
            <td>
                Custom events that emulate swiping on touch devices. If the device is non-touch,
                standard mouse events are used instead.
            </td>
        </tr>
    </tbody>
</table>

## Conventions ##

While the Sass/CSS layer uses the BEM naming convention, the JavaScript layer adheres to the following conventions.
These conventions should be abided by when submitting pull requests.

Classes
* Should be in capitalized camel case form: `FooBar`
* Should extend the `Toolkit.Component` prototype

Methods and Properties
* Should be in camel case form: `fooBar()`
* Should be prefixed with `_` when used internally and not be publicly available: `_fooBar()`

Methods
* Should be prefixed with `on` when used as an event handler / callback: `onFooBar(e)`
* Should, for the most part, be written in verb / action form
* Getters and setters should be separate