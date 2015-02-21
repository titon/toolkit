# Component System #

The individual components that make up the majority of Toolkit are powered by a robust object-oriented [class system](class.md). The component system is composed of 3 distinct [component classes](../../components/component.md), which are `Component`, `TemplateComponent`, and `CompositeComponent`. The `Component` class inherits from the [Base class](base.md) and acts as the parent for `TemplateComponent`, which in turn is the parent for `CompositeComponent`. The differences between the 3 classes are as follows:

* `Component` - Uses an existing DOM element as the components element
* `TemplateComponent` - Creates a new DOM element based on a template, to be used as the components element
* `CompositeComponent` - Creates and manages multiple DOM elements based on a template

## Templates ##

Templates are strings of HTML markup used for the creation of DOM elements and are represented by the `template` option, or by an option that ends in `Template`. They are primarily used by "created" components as the main element for interaction.

For example, the [Modal component](../../components/modal.md) uses the following template markup to create the elements that are used in the page.

```javascript
{
    template: '<div class="modal">' +
        '<div class="modal-outer">' +
            '<div class="modal-inner" data-modal-content></div>' +
            '<button class="modal-close" data-modal-close><span class="x"></span></button>' +
        '</div>' +
    '</div>'
}
```

Templates can be customized by overriding the `template` option. When customizing however, it's important to associate the custom markup with class mappings. To map where elements are found, the classes under the "Found With" properties table column should be used. To map where events are bound, the classes under the "Bound To" methods table column should be used. These tables can be found under the documentation for each component.

### Lazy-loaded Templates ###

When defining a template as a literal string, you lose the bonus of dynamically generating classes names or markup as the strings are evaluated on load. To circumvent this, a template can be defined as a function that returns a string, and will only be executed when required. Additionally, the function will be pass the `Toolkit.bem()` function as the 1st argument, and `Toolkit.namespace` as the 2nd argument for use in the template.

The previous modal example can now be written as such.

```javascript
{
    template: function(bem, namespace) {
        return '<div class="' + bem('modal') + '">' +
            '<div class="' + bem('modal', 'outer') + '">' +
                '<div class="' + bem('modal', 'inner') + '" data-modal-content></div>' +
                '<button class="' + bem('modal', 'close') + '" data-modal-close><span class="x"></span></button>' +
            '</div>' +
        '</div>';
    }
}
```

### Elements As Templates ###

It's also possible to use existing DOM elements as a template. This is especially useful for components where each instance of the component should use the same DOM element &mdash; blackouts for example. Providing an element ID for the `templateFrom` option will attempt to use that element as the template.

```javascript
{
    templateFrom: '#some-element'
}
```

We can also define a template using a script tag (or the new template tag).

```html
<script type="text/html" id="some-element">
    <div class="modal">
        <div class="modal-inner" data-modal-content></div>
    </div>
</script>
```

If no element is found, the component will fall back to the `template` option.

## Options ##

The component layer adds more functionality to options compared to its base counter-part.

### Data Attribute Options ###

At the highest level we have global options. At the middle level we have constructor options. And at the lowest level, the element, we have data attribute options. Data attributes permit individual elements to inherit custom options that override all other options.

Each data attribute must be defined in the format of `data-{component}-{option}="{value}"`. The component and option names will be in all lowercase format.

Say we have 3 carousels on a page, but we want separate animations for each, and we only want to initialize the component once. This can easily be solved through data attributes.

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

The previous example is only possible for embedded components, since they only handle a single element. On the other hand, created components are initialized on a collection of elements, so each individual node can define their own options that will inherit at runtime.

```html
<button type="button" class="js-tooltip" data-tooltip="A message!" data-tooltip-position="top-center">Top Centered</button>

<button type="button" class="js-tooltip" data-tooltip="/load/this">AJAX</button>
```

```javascript
$('.js-tooltip').tooltip({
    position: 'top-left'
});
```

### Option Groups ###

When individual data attributes become too cumbersome, the option groups system comes into play. This system allows multiple options to be grouped and aliased by a unique key. Simple define a `groups` object in the options object.

```javascript
$('.js-modal').modal({
    animation: 'slide-in-top',
    groups: {
        static: {
            fullScreen: false
        },
        dynamic: {
            fullScreen: true
        }
    }
});
```

To inherit the group options, set a group data attribute on the element in the format of `data-{component}-group="{key}"`.

```html
<a href="#static" class="js-modal" data-modal-group="static">Static Modal</a>

<a href="/load/this/url" class="js-modal" data-modal-group="dynamic">Dynamic Modal</a>
```

<div class="notice is-info">
    Responsive options can be defined in option groups.
</div>

## Events ##

Of course the component system improves events.

### Namespaced Events ###

Attaching namespaced events to the element that was initialized on by a component allows those events to be triggered when `fireEvent()` is called. This technique allows for per-element events within a component while hooks apply to all. The following example shows how to attach these events.

```javascript
// Hooks
$('#tabs').tab({
    onShown: function() {
        this.element.addClass('foobar');
    }
});

// Events
$('#tabs').on('shown.toolkit.tab', function(e) {
    e.context.element.addClass('foobar');
});
```

What we did was attach a namespaced event to the same element in the format of `{event}.toolkit.{component}` (no "on" required in the event name). Now anytime a tab is clicked, the `onShown` hook will trigger, and all `shown.toolkit.tab` event handlers will trigger.

<div class="notice is-info">
    The "this" context within event handlers will be the respective element.
    The component instance can be found under the <code>context</code> property in the event object.
</div>

## Namespaces ##

By default, components *can not* be nested within each other, as DOM traversal and event binding get confused on who the parent is, and who the children are. However! To solve this problem, Toolkit provides a concept of namespacing, which is handled through data attributes. Each element that is being found through traversal, or being bound with events, should define data attributes that match the parents data attribute.

An example might clear any confusion. Say we have a tabs system, and inside one of the tab sections, we have another tabs system. We can easily error-proof this by filling in the data attributes.

```html
<div class="tabs" data-tab="foo">
    <nav class="tab-nav" data-tab-nav="foo">
        <ul>
            <li><a href="javascript:;" class="button">Tab 1</a></li>
            <li><a href="javascript:;" class="button">Tab 2</a></li>
        </ul>
    </nav>

    <section class="tab-section" data-tab-section="foo"></section>
    <section class="tab-section" data-tab-section="foo">

        <div class="tabs" data-tab="bar">
            <nav class="tab-nav" data-tab-nav="bar">
                <ul>
                    <li><a href="javascript:;" class="button">Tab 1</a></li>
                    <li><a href="javascript:;" class="button">Tab 2</a></li>
                </ul>
            </nav>

            <section class="tab-section" data-tab-section="bar"></section>
            <section class="tab-section" data-tab-section="bar"></section>
        </div>
        
    </section>
</div>
```

As you can see above, all elements that belong to the parent have a namespace of `foo`, while all children have `bar`. That's all there is to it!
