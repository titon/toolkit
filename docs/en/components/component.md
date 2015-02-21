# Component #

The component layer is composed of 3 distinct classes -- `Component`, `TemplateComponent`, and `CompositeComponent` -- all of which support their own unique methods, properties, and options. These classes also extend functionality from the [Base class](../development/js/base.md).

More information on these classes can be found in the [component system documentation](../development/js/component.md).

## Options ##

Inherits all options from the [Base class](../development/js/base.md#options).

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
            <td>ajax</td>
            <td>object</td>
            <td></td>
            <td>Object of options to pass to <code>$.ajax()</code>. These will be overridden if necessary.</td>
        </tr>
        <tr>
            <td>className</td>
            <td>string</td>
            <td></td>
            <td>Class name to append to the target element. Allows for custom styles.</td>
        </tr>
        <tr>
            <td>context</td>
            <td>element</td>
            <td></td>
            <td>The element to attach delegated events to, or to use as a parent. Defaults to the document body.</td>
        </tr>
        <tr class="table-divider">
            <td colspan="4">TemplateComponent</td>
        </tr>
        <tr>
            <td>template</td>
            <td>string</td>
            <td></td>
            <td>The HTML used to create the component element.</td>
        </tr>
        <tr>
            <td>templateFrom</td>
            <td>string</td>
            <td></td>
            <td>The ID of an element to use as the template.</td>
        </tr>
        <tr class="table-divider">
            <td colspan="4">CompositeComponent</td>
        </tr>
        <tr>
            <td>wrapperClass</td>
            <td>string</td>
            <td></td>
            <td>The class name to set on the composite wrapper.</td>
        </tr>
        <tr>
            <td>wrapperTemplate</td>
            <td>string</td>
            <td>&lt;div class="toolkit-plugin"&gt;&lt;/div&gt;</td>
            <td>The HTML used to create the wrapper element.</td>
        </tr>
    </tbody>
</table>

## Events ##

Inherits all events from the [Base class](../development/js/base.md#events).

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
            <td>hiding</td>
            <td></td>
            <td>Triggered before the element is hidden.</td>
        </tr>
        <tr>
            <td>hidden</td>
            <td></td>
            <td>Triggered after the element is hidden.</td>
        </tr>
        <tr>
            <td>load</td>
            <td>string:response</td>
            <td>
                Triggered after an AJAX call has finished but before the response is rendered.
                Only triggers for HTML responses.
            </td>
        </tr>
        <tr>
            <td>process</td>
            <td>mixed:response</td>
            <td>Triggered after an AJAX call has finished and only if the response is non-HTML (JSON, XML, etc).</td>
        </tr>
        <tr>
            <td>showing</td>
            <td></td>
            <td>Triggered before the element is shown.</td>
        </tr>
        <tr>
            <td>shown</td>
            <td></td>
            <td>Triggered after the element is shown.</td>
        </tr>
    </tbody>
</table>

## Properties ##

Inherits all properties from the [Base class](../development/js/base.md#properties).

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
            <td>
                The primary element used by the component.
                Is built from the <code>template</code> or <code>templateFrom</code> options,
                or is passed through the constructor.
            </td>
        </tr>
        <tr>
            <td>namespace</td>
            <td>string</td>
            <td>The namespace for the current instance. The namespace is extracted from a data attribute on the primary element.</td>
        </tr>
        <tr>
            <td>node</td>
            <td>element</td>
            <td>
                The element that currently activated the component.
                Primarily used by "created" components.
            </td>
        </tr>
        <tr class="table-divider">
            <td colspan="4">CompositeComponent</td>
        </tr>
        <tr>
            <td>elements</td>
            <td>collection</td>
            <td>A collection of elements used by the component.</td>
        </tr>
        <tr>
            <td>nodes</td>
            <td>collection</td>
            <td>A collection of elements that are used for activating the component.</td>
        </tr>
        <tr>
            <td>wrapper</td>
            <td>element</td>
            <td>The wrapping element that contains all the individual elements.</td>
        </tr>
    </tbody>
</table>

## Methods ##

Inherits all methods from the [Base class](../development/js/base.md#methods).

<table class="table is-striped data-table">
    <thead>
        <tr>
            <th>Method</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>hide()</td>
            <td>Hide the element.</td>
        </tr>
        <tr>
            <td>id([string:...args])</td>
            <td>Generate a unique CSS class name using the components name, UID, and defined arguments.</td>
        </tr>
        <tr>
            <td>inheritOptions(object:options, element:element)</td>
            <td>Inherit and merge options from the target elements data attributes.</td>
        </tr>
        <tr>
            <td>loadContent(string:content[, object:params])</td>
            <td>
                Attempts to load content and then <code>position()</code> it.
                If the content is a URL, request it. If the content is an ID, fetch it. 
                If the content is a literal string, use it. 
                Params will be passed as a 2nd argument to <code>requestData()</code>.
            </td>
        </tr>
        <tr>
            <td>ns([string:element[, string:block]])</td>
            <td>Generate a unique CSS data attribute selector based off the component and the namespace.</td>
        </tr>
        <tr>
            <td>position(string:response)</td>
            <td>Handles HTML AJAX responses. Will re-position the element depending on the component.</td>
        </tr>
        <tr>
            <td>process(mixed:response)</td>
            <td>
                Handles non-HTML AJAX responses.
                If the response is JSON and a <code>callback</code> property exists,
                the function defined will be triggered (JSONP style).
            </td>
        </tr>
        <tr>
            <td>readOption(element:element, string:key)</td>
            <td>Read an option from an elements data attribute else fallback to the original option.</td>
        </tr>
        <tr>
            <td>readValue(element:element, mixed:query)</td>
            <td>
                Extract a value from an element using a defined query.
                The query may be an element property, attribute, or function callback.
            </td>
        </tr>
        <tr>
            <td>render(mixed:template)</td>
            <td>
                Render a template and return a jQuery element.
            </td>
        </tr>
        <tr>
            <td>requestData(string|object:options[, object:params])</td>
            <td>
                Requests data from a URL using an AJAX call.
                Will automatically prepare an XHR object and inherit settings from <code>options.ajax</code>.
                The first argument can either be a URL or an object of AJAX options.
            </td>
        </tr>
        <tr>
            <td>setElement(element:element)</td>
            <td>Set the primary element and extract a namespace.</td>
        </tr>
        <tr>
            <td>setOptions(object:options[, element:inheritFrom])</td>
            <td>
                Set the options to use in the component.
                Will alter options based on current device and will inherit from data attributes if an element is passed.
            </td>
        </tr>
        <tr>
            <td>show([element:node])</td>
            <td>Show the element and set an optional activating node.</td>
        </tr>
        <tr class="table-divider">
            <td colspan="4">TemplateComponent</td>
        </tr>
        <tr>
            <td>createElement([object:options])</td>
            <td>
                Create an element from the <code>template</code> or <code>templateFrom</code> options.
                Will set class names on the element based on defined options.
            </td>
        </tr>
        <tr class="table-divider">
            <td colspan="4">CompositeComponent</td>
        </tr>
        <tr>
            <td>createElement(element:node[, object:options])</td>
            <td>Works exactly like the parent method but will extract custom options from the node.</td>
        </tr>
        <tr>
            <td>createWrapper()</td>
            <td>Create the wrapper element from the <code>wrapperTemplate</code> option.</td>
        </tr>
        <tr>
            <td>hideElements()</td>
            <td>Hide all elements within the wrapper.</td>
        </tr>
        <tr>
            <td>loadElement(element:node[, func:callback])</td>
            <td>
                Find and return an element that is tied to the node. If no element exists, create it, 
                assign a unique ID, and cache it. An optional callback can be defined to modify the element when it's created.
            </td>
        </tr>
    </tbody>
</table>
