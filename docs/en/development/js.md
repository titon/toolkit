# JavaScript Development #

## Component System ##

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
Any option that begins with `on` and defines an anonymous function is considered an event.

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
            <th>Arguments</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>onInit</td>
            <td></td>
            <td>Triggered immediately after a component has initialized.</td>
        </tr>
        <tr>
            <td>onShow</td>
            <td></td>
            <td>
                Triggered when the component element is shown (this can change depending on context).
                Is also triggered after an AJAX call has finished.
            </td>
        </tr>
        <tr>
            <td>onHide</td>
            <td></td>
            <td>Triggered when the component element is hidden (this also depends on context).</td>
        </tr>
        <tr>
            <td>onLoad</td>
            <td>response</td>
            <td>Triggered after an AJAX call has finished, but before the response is rendered.</td>
        </tr>
    </tbody>
</table>

<div class="notice is-warning">
    The event system will be changing in future versions to support native element events instead of option events.
    This allows multiples events to be bound and to be bound per element.
</div>

### Methods ###

Every component class has a set of methods that can be used publicly.

## Custom Template Markup ##

## Reserved Namespaces ##

## Extensions ##

### jQuery ###

### MooTools ###
