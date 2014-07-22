# Component System #

The individual components that make up the majority of Toolkit are powered by a robust object-oriented class layer.
The [Component class](../../components/component.md) inherits from the [Base class](base.md) which provides common methods,
properties, and events &mdash; for all components -- all of which can be found in more detail below.

Before we learn more about the component system, we must differentiate between the two types of components.
Every type of component falls into one of the following.

* Created
    * Component class is initialized on an element that activates the component.
    * Component element is created with JavaScript through a template option.
* Embedded
    * Component class is initialized on an existing element in the DOM.
    * Component element is the target element from the DOM.

## Templates ##

Templates are strings of HTML markup used for the creation of DOM elements and are represented by the `template` option.
They are primarily used by "created" components as the main element for interaction.

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

Alongside functionality inherited from the [Base class](../development/js/base.md#options),
the component system adds further extensibility for options.

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
On the other hand, created components are initialized on a collection of elements,
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

## Events ##

Similar to hooks in the [Base class](../development/js/base.md#hooks), the events layer in components provides a way of
plugging into the rendering cycle.

### Namespaced Events ###

Attaching namespaced events to the element that was initialized on by a component allows those events to be triggered
when `fireEvent()` is called. This technique allows for per-element events while hooks apply to all elements of the component.
The following example shows how to attach these events.

```javascript
// Hooks
$('#tabs').tab({
    onShow: function(tab) {
        this.element.addClass('foobar');
    }
});

// Events
$('#tabs').on('show.toolkit.tab', function(e, tab) {
    e.context.element.addClass('foobar');
});
```

What we did was attach a namespaced event to the same element in the format of `{event}.toolkit.{component}`
(no "on" required in the event name). Now anytime a tab is clicked, the `onShow` hook will trigger,
and all `show.toolkit.tab` event handlers will trigger.

<div class="notice is-info">
    The "this" context within event handlers will be the respective element.
    The component instance can be found under the <code>context</code> property in the event object.
</div>