# Base Class #

The base class that all components, behaviors, and their children extend from.

## Usage ##

Understanding the base class may require prior knowledge of Toolkit's [class system](class.md).

### Options ###

Extensibility of classes can be achieved through customizable options. Each class has a different set of options and these options can be used to alter functionality.

Options can be set globally by modifying the static `options` object on the class. These options will need to be modified *before* a class is initialized.

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

Options can also be set on a per instance basis when initializing a class. These options will inherit and override the global options.

```javascript
$('.js-tooltip').tooltip({
    position: 'top-right'
});
```

#### Responsive Options ####

For situations where class options need to change depending on the size of the device, the `responsive` option can be used (this option can be used by *all* classes). This option should define an object of settings, with each setting having a `breakpoint` to compare against and the custom options to override with.

For example, our carousel should have different item counts depending on device size. The default options will apply to all devices not found in the breakpoints.

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
    Breakpoint detection uses the built in <a href="https://developer.mozilla.org/en-US/docs/Web/API/Window.matchMedia">matchMedia()</a> function. All breakpoint definitions should follow the media query specification.
</div>

<div class="notice is-warning">
    Breakpoint detection only triggers on the initial page load and will not trigger if you resize your browser manually by resizing the OS window.
</div>

<div class="notice is-error">
    The <code>matchMedia()</code> function is not available in IE9 and below and will require a polyfill.
</div>

### Hooks ###

Similar to native DOM events, the class layer has a system for dispatching callbacks at specific events called hooks. The difference between DOM events and hooks is that hooks are set as options through the class constructor or manually added through the `addHook()` and `addHooks()` methods. When setting through options, any option that begins with `on`, is named after an event, and defines an anonymous function, is considered a hook.

Now anytime `fireEvent()` is called, all attached hooks will also be triggered.

```javascript
// Set through options
$('.carousel').carousel({
    onInit: function() {
        // Do something
    }
});

// Set through method
$('.carousel').toolkit('carousel').addHook('init', function() {
    // Do something
});
```

<div class="notice is-info">
    The "this" context within hooks will be bound to the class instance.
</div>

<div class="notice is-info">
    Hooks are triggered <i>before</i> native DOM events.
</div>

## Options ##

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
            <td>cache</td>
            <td>bool</td>
            <td>true</td>
            <td>Whether to cache internal data or the response of AJAX requests.</td>
        </tr>
        <tr>
            <td>debug</td>
            <td>bool</td>
            <td>false</td>
            <td>Whether to enable debugging for this class.</td>
        </tr>
    </tbody>
</table>

## Events ##

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
            <td>init</td>
            <td></td>
            <td>Triggered after a plugin has initialized.</td>
        </tr>
        <tr>
            <td>destroying</td>
            <td></td>
            <td>Triggered before a plugin is destroyed.</td>
        </tr>
        <tr>
            <td>destroyed</td>
            <td></td>
            <td>Triggered after a plugin is destroyed.</td>
        </tr>
    </tbody>
</table>

## Properties ##

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
            <td>enabled</td>
            <td>boolean</td>
            <td>
                Whether the instance is currently enabled or not.
                Disabled plugins will not trigger events or functionality.
                Can be toggled through <code>enable()</code> and <code>disable()</code> methods.
            </td>
        </tr>
        <tr>
            <td>cache</td>
            <td>object</td>
            <td>Cached data by key.</td>
        </tr>
        <tr>
            <td>name</td>
            <td>string</td>
            <td>The name of the class. This should not be modified.</td>
        </tr>
        <tr>
            <td>options</td>
            <td>object</td>
            <td>Configurable options. More information can be found above.</td>
        </tr>
        <tr>
            <td>uid</td>
            <td>int</td>
            <td>
                A unique identifier for the plugin instance.
                The value correlates to the number of instances in the page.
            </td>
        </tr>
        <tr>
            <td>version</td>
            <td>string</td>
            <td>The last version this class was updated. This should not be modified.</td>
        </tr>
    </tbody>
</table>

## Methods ##

<table class="table is-striped data-table">
    <thead>
        <tr>
            <th>Method</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>addEvent(string:event, string:context, string|func:callback[, string:selector])</td>
            <td>
                Add an event that will be bound during <code>bindEvents()</code>. 
                The context should be the name of a class property, or the document, or the window. 
                The callback should be the name of a class function, or a function itself. 
                The selector can optionally be defined to apply delegation.
            </td>
        </tr>
        <tr>
            <td>addEvents(array:events)</td>
            <td>
                Add multiple events. Each item in the array should be an array with 3-4 items, 
                with each index representing an argument of <code>addEvent()</code>.
            </td>
        </tr>
        <tr>
            <td>addHook(string:type, func:callback)</td>
            <td>Add a hook callback that will be executed during specific events.</td>
        </tr>
        <tr>
            <td>addHooks(string:type, array:callbacks)</td>
            <td>Add multiple hooks. The callbacks should be an array of functions.</td>
        </tr>
        <tr>
            <td>bindEvents(string:type)</td>
            <td>Bind or unbind events for elements found in the events mapping. The type should either be "on" or "off".</td>
        </tr>
        <tr>
            <td>destroy()</td>
            <td>Disable the plugin, unbind events, remove elements, and delete the instance.</td>
        </tr>
        <tr>
            <td>disable()</td>
            <td>Disable the plugin and unbind events.</td>
        </tr>
        <tr>
            <td>enable()</td>
            <td>Enable the plugin and bind events.</td>
        </tr>
        <tr>
            <td>fireEvent(string:type[, array:args])</td>
            <td>
                Trigger an event with optional arguments to pass.
                Will execute all hooks for the defined type and any DOM events that are attached to related elements.
                Will also log to console if debugging is enabled.
            </td>
        </tr>
        <tr>
            <td>initialize()</td>
            <td>Triggered at the end of construction. Will trigger event binding and init events.</td>
        </tr>
        <tr>
            <td>removeHook(string:type[, func:callback])</td>
            <td>
                Remove a hook callback by type.
                If no callback is provided, all hooks for that type will be removed.
            </td>
        </tr>
        <tr>
            <td>setOptions(object:options)</td>
            <td>
                Set the options unique for the current plugin instance.
                Will also apply any responsive options and automatically add hooks.
            </td>
        </tr>
    </tbody>
</table>
