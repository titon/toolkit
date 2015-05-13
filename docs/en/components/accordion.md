# Accordion #

Allows collapsing and expanding of multiple sections of content.

## Usage ##

An accordion must be structured using an unordered or ordered list. Every item in the list should have an accompanying header and section with associated data attributes. The header will be bound with a click event that toggles the display of its sibling section, while also closing other sections (can be changed through options).

```html
<ul class="accordion" data-accordion> 
    <li>
        <header class="accordion-header" data-accordion-header>
            Section Header
        </header>
        <section class="accordion-section" data-accordion-section>
            <div class="accordion-body">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Quisque ipsum sem, faucibus a consectetur vel, dictum ut sapien.
                Suspendisse at odio ut risus sagittis viverra et vitae tortor.
                Fusce id aliquam enim, ac blandit dolor. Vivamus porta convallis vestibulum.
                Suspendisse pretium, dolor quis semper ultricies, magna felis aliquam nisl,
                at semper mauris sem non purus. Vivamus a felis nibh. Praesent nec elementum nulla,
                quis egestas nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra.
            </div>
        </section>
    </li>
</ul>
```

Once the markup is in place, an accordion can be initialized.

```javascript
$('.accordion').accordion();
```

<div class="notice is-info">
    The <code>data-accordion-*</code> attributes are required so that the JavaScript layer can find or bind elements in the DOM.
</div>

<div class="notice is-info">
    Accordions can be nested by <a href="../development/js/component.md#namespaces">utilizing component namespaces</a>.
</div>

<div class="notice is-warning">
    The <code>.accordion-section</code> class is required for slide animations. Applying padding to this element will break the slide logic, so style <code>.accordion-body</code> instead.
</div>

### Notes ###

* The `[data-accordion-header]` will be clickable, no need for anchor tags.
* The `.show` and `.hide` classes will be toggled on the `[data-accordion-section]` to trigger slide animations.
* The currently open section will have an `.is-active` class on the parent `li`.

## ARIA ##

The `tab`, `tablist`, and `tabpanel` roles, and the appropriate `aria-*` attributes are required when supporting ARIA.

```html
<ul class="accordion" role="tablist">
    <li>
        <header class="accordion-header" role="tab" data-accordion-header>...</header>
        <section class="accordion-section" role="tabpanel" data-accordion-section>...</section>
    </li>
</ul>
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
            <td>$accordion-class</td>
            <td>.accordion</td>
            <td>CSS class name for the accordion wrapper.</td>
        </tr>
        <tr>
            <td>$accordion-class-body</td>
            <td>.accordion-body</td>
            <td>CSS class name for the accordion section inner body.</td>
        </tr>
        <tr>
            <td>$accordion-class-header</td>
            <td>.accordion-header</td>
            <td>CSS class name for the accordion header.</td>
        </tr>
        <tr>
            <td>$accordion-class-section</td>
            <td>.accordion-section</td>
            <td>CSS class name for the accordion section.</td>
        </tr>
        <tr>
            <td>$accordion-transition</td>
            <td>.3s</td>
            <td>The transition time for accordion slide animations.</td>
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
            <td>collapsible</td>
            <td>bool</td>
            <td>false</td>
            <td>Allows the open section to be closed, without having to open another section.</td>
        </tr>
        <tr>
            <td>defaultIndex</td>
            <td>int</td>
            <td>0</td>
            <td>The index of the section to open on page load.</td>
        </tr>
        <tr>
            <td>mode</td>
            <td>string</td>
            <td>click</td>
            <td>
                The type of interaction for toggling a section.
                Accepts click or hover.
            </td>
        </tr>
        <tr>
            <td>multiple</td>
            <td>bool</td>
            <td>false</td>
            <td>Allows multiple sections to be open simultaneously. Will override the <code>collapsible</code> option.</td>
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
            <td>showing</td>
            <td>element:section, element:header, int:oldIndex</td>
            <td>Triggered before a section is shown.</td>
        </tr>
        <tr>
            <td>shown</td>
            <td>element:section, element:header, int:newIndex</td>
            <td>Triggered after a section is shown.</td>
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
            <th>Found With</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>headers</td>
            <td>collection</td>
            <td>A collection of header elements within the accordion.</td>
            <td>[data-accordion-header]</td>
        </tr>
        <tr>
            <td>index</td>
            <td>int</td>
            <td>The index of the currently opened section.</td>
            <td></td>
        </tr>
        <tr>
            <td>node</td>
            <td>element</td>
            <td>The header element of the currently open section.</td>
            <td></td>
        </tr>
        <tr>
            <td>sections</td>
            <td>collection</td>
            <td>A collection of section elements within the accordion.</td>
            <td>[data-accordion-section]</td>
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
            <td>calculate([func:callback])</td>
            <td>Calculate and cache the heights of each section. An optional callback can be passed to fetch the height.</td>
            <td></td>
        </tr>
        <tr>
            <td>jump(int:index)</td>
            <td>Open a specific section using the index in the collection.</td>
            <td></td>
        </tr>
        <tr>
            <td>show(element:header)</td>
            <td>Open a specific section using the sibling header.</td>
            <td>[data-accordion-header]</td>
        </tr>
    </tbody>
</table>
