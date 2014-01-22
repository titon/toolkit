# JavaScript Development #

The ins and outs of the JavaScript layer within Toolkit.

* [Component System](#component-system)
    * [Templates](#templates)
    * [Options](#options)
    * [Events](#events)
    * [Properties](#properties)
    * [Methods](#methods)
* [Reserved Namespaces](#reserved-namespaces)
* [Naming Conventions](#naming-conventions)
* [Extensions](#extensions)
    * [jQuery](#jquery)
    * [MooTools](#mootools)

## Component System ##

The individual components that make up the Toolkit JavaScript layer are powered by a robust object-oriented class layer.
This base class that all components extend can be found under the `Toolkit.Component` object.
The Component class provides common methods, options, and events &mdash; all of which can be found in more detail below.

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
* Embedded: Accordion, Carousel, Dropdown, Input, LazyLoad, Matrix, Pin, Stalker, Tabs, TypeAhead

### Templates ###

Templates are strings of HTML markup used for the creation of DOM elements, and are represented by the `template` option.
They are primarily used by activated components as the main element for interaction.

For example, the Modal component uses the following template markup to create the elements that are used in the page.

```javascript
{
    template: '<div class="modal">' +
        '<div class="modal-handle">' +
            '<div class="modal-inner"></div>' +
            '<a href="javascript:;" class="modal-close modal-event-close"><span class="x"></span></a>' +
        '</div>' +
    '</div>'
}
```

Templates can be customized by overriding the `template` option.
When customizing however, it's important to associate the custom markup with class mappings.
These mappings tell the component layer where critical elements within the template can be found.

Continuing with the Modal example, the component must have knowledge of where to place content within the modal.
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

#### Elements as Templates ####

It's also possible to use existing hidden DOM elements as a template.
This is especially useful for components where each instance of the component should use the same DOM element &mdash; blackouts for example.
Providing an element ID for the `templateFrom` option will attempt to use that element as the template.

```javascript
{
    templateFrom: '#some-element'
}
```

If no element is found, the component will fall back to the `template` option.

### Options ###

Extensibility of components can be achieved through customizable options.
Each component has a different set of options, and these options can be used to toggle functionality.

Options can be set globally by modifying the `options` object on the component class.
These options will need to be modified *before* a component is initialized.

```javascript
// Single option
Toolkit.Tooltip.options.position = 'topRight';

// Multiple options
Toolkit.Tooltip.options = $.extend(Toolkit.Tooltip.options, {
    position: 'topRight',
    follow: true,
    mouseThrottle: 75
});
```

Options can also be set on a per instance basis when initializing a component.
These options will inherit and overwrite the global options.

```javascript
$('.js-tooltip').tooltip({
    position: 'topRight'
});
```

### Events ###

Similar to native JavaScript events, the component layer has a system for dispatching callbacks at specific events.
The difference between native events and Toolkit events, is that Toolkit events are set as options through the constructor.
Any option that begins with `on` and defines an anonymous function is considered an event, for example.

```javascript
$('#carousel').carousel({
    onInit: function() {
        // Do something
    }
});
```

<div class="notice is-info">
    The "this" context within event functions will be bound to the component object instance.
</div>

The following events exist in all components, however, each component may have their own set of unique events.

<table class="table">
    <thead>
        <tr>
            <th>Event</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>onInit()</td>
            <td>Triggered immediately after a component has initialized.</td>
        </tr>
        <tr>
            <td>onShow()</td>
            <td>
                Triggered when the component element is shown (this can change depending on context),
                and after an AJAX call has finished.
            </td>
        </tr>
        <tr>
            <td>onHide()</td>
            <td>Triggered when the component element is hidden (this also depends on context).</td>
        </tr>
        <tr>
            <td>onLoad(response)</td>
            <td>Triggered after an AJAX call has finished, but before the response is rendered.</td>
        </tr>
    </tbody>
</table>

<div class="notice is-warning">
    The event system will be changing in future versions to support native element events instead of option events.
    This allows multiples events to be bound and to be bound per element.
</div>

### Properties ###

The following properties are available on all class instances, but not all components make use of them.

<table class="table">
    <thead>
        <tr>
            <th>Property</th>
            <th>Type</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>enabled</td>
            <td>Boolean</td>
            <td>
                Whether the instance is currently enabled or not.
                Disabled components will not trigger events or functionality.
                Can be toggled through <code>enable()</code> and <code>disable()</code> methods.
            </td>
        </tr>
        <tr>
            <td>element</td>
            <td>Element</td>
            <td>
                The primary element used by the component.
                Is built from the <code>template</code> or <code>templateFrom</code> options.
            </td>
        </tr>
        <tr>
            <td>elements</td>
            <td>Element collection</td>
            <td>
                A collection of elements used by the component.
            </td>
        </tr>
        <tr>
            <td>node</td>
            <td>Element</td>
            <td>
                The element that currently activated the component.
                Primarily used by activated components.
            </td>
        </tr>
        <tr>
            <td>nodes</td>
            <td>Element collection</td>
            <td>
                A collection of elements that are used for activating the component.
            </td>
        </tr>
        <tr>
            <td>options</td>
            <td>Object</td>
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

<div class="notice is-warning">
    Method availability, functionality, and argument ordering may differ between the jQuery and MooTools versions.
</div>

<table class="table">
    <thead>
        <tr>
            <th>Method</th>
            <th>Vendor</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>createElement([options])</td>
            <td>Both</td>
            <td>Create an element from the <code>template</code> or <code>templateFrom</code> options.</td>
        </tr>
        <tr>
            <td>setElement(element[, options])</td>
            <td>Both</td>
            <td>Set the element to use by the component. Will set class names on the element based on defined options.</td>
        </tr>
        <tr>
            <td>parseTemplate(template)</td>
            <td>MooTools</td>
            <td>Parse a template string into a set of DOM elements.</td>
        </tr>
        <tr>
            <td>setOptions(defaults, options)</td>
            <td>Both</td>
            <td>
                Set the options to use in the component.
                Will alter options based on current device and will automatically bind option <code>on</code> events.
            </td>
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
            <td>fireEvent(event[, args])</td>
            <td>Both</td>
            <td>Trigger an event with optional arguments to pass. Will find an event within the options object.</td>
        </tr>
        <tr>
            <td>readValue(element, query)</td>
            <td>Both</td>
            <td>
                Extract a value from an element using a defined query.
                The query may be an element property, attribute, or function callback.
            </td>
        </tr>
        <tr>
            <td>requestData(url[, before[, done[, fail]]])</td>
            <td>Both</td>
            <td>
                Requests data from a URL using an AJAX call.
                Will automatically prepare an XHR object and inherit settings from <code>options.ajax</code>.
                The <code>before</code>, <code>done</code>, and <code>fail</code> arguments can be set to override the default callbacks.
            </td>
        </tr>
        <tr>
            <td>show([node])</td>
            <td>MooTools</td>
            <td>Show the element and set an optional activating node.</td>
        </tr>
        <tr>
            <td>hide([callback])</td>
            <td>MooTools</td>
            <td>Hide the element and trigger an optional callback function.</td>
        </tr>
    </tbody>
</table>

## Reserved Namespaces ##

## Naming Conventions ##

## Extensions ##

### jQuery ###

### MooTools ###
