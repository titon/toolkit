# JavaScript Development #

The ins and outs of the JavaScript layer within Toolkit.

* [Component System](#component-system)
    * [Templates](#templates)
    * [Options](#options)
    * [Events](#events)
    * [Properties](#properties)
    * [Methods](#methods)
* [Reserved Namespaces](#reserved-namespaces)
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
* Embedded: Accordion, Carousel, Dropdown, Input, LazyLoad, Matrix, Pin, Stalker, Tabs

### Templates ###

Templates are strings of HTML markup used for the creation of DOM elements.
The are primarily used by activated components as the main element for interaction.

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

### Methods ###

Every component class has a set of methods that can be used publicly.

## Reserved Namespaces ##

## Extensions ##

### jQuery ###

### MooTools ###
