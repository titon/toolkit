# Tab #

Organizes multiple sections of content into toggleable tabs.

## Usage ##

The tab component is primarily used in the display of multiple sections of content, with only a single section open at any time, all toggled through a navigation of tabbed links.

The tabs that make up the component should be wrapped in a `.tab-nav` (with `data-tab-nav`) and structured with a `ul` list. The sections that associate to tabs should be created with `.tab-section` and `data-tab-section`. Both of which can be wrapped by a `.tabs` element.

```html
<div class="tabs" data-tab>
    <nav class="tab-nav" data-tab-nav>
        <ul>
            <li><a href="#one">First</a></li>
            <li><a href="#two">Second</a></li>
            <li><a href="#three">Third</a></li>
        </ul>
    </nav>

    <section class="tab-section" data-tab-section>...</section>
    <section class="tab-section" data-tab-section>...</section>
    <section class="tab-section" data-tab-section>...</section>
</div>
```

The component should be initialized on an element that wraps both the navigation and the sections.

```javascript
$('.tabs').tab();
```

<div class="notice is-info">
    The <code>data-tab-*</code> attributes are required so that the JavaScript layer can find or bind elements in the DOM.
</div>

<div class="notice is-info">
    Tabs can be nested by <a href="../development/js/component.md#namespaces">utilizing component namespaces</a>.
</div>

<div class="notice is-info">
    The markup for tabs can be customized and re-arranged extensively. The only requirements are the inclusion of tab data attributes.
</div>

<div class="notice is-warning">
    The <code>href</code> of every tab does <b>not</b> point to a section ID. For every tab, there needs to be an associated section in the markup, even if it's empty. The order and index in the collection determines association.
</div>

### Horizontal Tabs ###

To display tabs horizontally alongside sections, and to update all navigation items to a vertical layout, use `.tabs--horizontal`. We suggest pairing this with the [Grid component](grid.md).

```html
<div class="tabs tabs--horizontal grid">
    <nav class="tab-nav col span-4" data-tab-nav>
        <ul>
            <li><a href="#one">First</a></li>
            <li><a href="#two">Second</a></li>
            <li><a href="#three">Third</a></li>
        </ul>
    </nav>

    <div class="col span-8">
        <section class="tab-section" data-tab-section>...</section>
        <section class="tab-section" data-tab-section>...</section>
        <section class="tab-section" data-tab-section>...</section>
    </div>
</div>
```

### Persist State ###

There are 2 ways to persist the open section between requests. The first, which also takes highest priority, is through cookies.

```javascript
$('.tabs').tab({
    persistState: true,
    cookie: 'foobar'
});
```

<div class="notice is-info">
    When using cookies, a <code>$.cookie()</code> method needs to exist on the jQuery object.
</div>

The second is through the hash fragment in the URL. We can either update the hash manually when a tab is clicked, or disable `preventDefault` and set the `href` to IDs.

```javascript
$('.tabs').tab({
    loadFragment: true,
    preventDefault: false
});
```

Lastly, if neither of those states are persisted, then the `defaultIndex` will be used.

### AJAX Loading ###

Loading in sections through AJAX is extremely easy, simple set the `href` on the tabs with the URL we want to request via AJAX.

```html
<div class="tabs">
    <nav class="tab-nav" data-tab-nav>
        <ul>
            <li><a href="/load/this">AJAX 1st</a></li>
            <li><a href="/load/that">AJAX 2nd</a></li>
            <li><a href="#three">Non-AJAX</a></li>
        </ul>
    </nav>

    <section class="tab-section" data-tab-section></section>
    <section class="tab-section" data-tab-section></section>
    <section class="tab-section" data-tab-section>...</section>
</div>
```

<div class="notice is-warning">
    Be sure to create empty sections to insert the response into, as the component does not automatically create them!
</div>

### Notes ###

* The `.show` and `.hide` classes will be toggled on the `.tab-section` to trigger display.
* The currently open section will have an `.is-active` class on the tabs parent `li`.

## ARIA ##

The `tab`, `tablist`, and `tabpanel` roles, and the appropriate `aria-*` attributes are required when supporting ARIA.

```html
<div class="tabs">
    <nav class="tab-nav" role="tablist" data-tab-nav>
        <ul>
            <li><a href="#one" role="tab">First</a></li>
        </ul>
    </nav>

    <section class="tab-section" role="tabpanel" data-tab-section>...</section>
</div>
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
            <td>$tab-class</td>
            <td>.tabs</td>
            <td>CSS class name for the tabs wrapper.</td>
        </tr>
        <tr>
            <td>$tab-class-modifier-horizontal</td>
            <td>.tabs--horizontal</td>
            <td>CSS class name for the tabs horizontal modifier.</td>
        </tr>
        <tr>
            <td>$tab-class-nav</td>
            <td>.tab-nav</td>
            <td>CSS class name for the tabs navigation wrapper.</td>
        </tr>
        <tr>
            <td>$tab-class-section</td>
            <td>.tab-section</td>
            <td>CSS class name for the individual tab section.</td>
        </tr>
        <tr>
            <td>$tab-modifiers</td>
            <td>("horizontal")</td>
            <td>List of modifiers to include in the CSS output. Accepts horizontal.</td>
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
            <td>cookie</td>
            <td>string</td>
            <td></td>
            <td>The name of the cookie when <code>persistState</code> is true.</td>
        </tr>
        <tr>
            <td>cookieDuration</td>
            <td>int</td>
            <td>30</td>
            <td>The duration in days to store the cookie.</td>
        </tr>
        <tr>
            <td>defaultIndex</td>
            <td>int</td>
            <td>0</td>
            <td>
                The index of the section to open on page load.
                Can be overridden by a fragment or cookie.
            </td>
        </tr>
        <tr>
            <td>getUrl</td>
            <td>string</td>
            <td>url</td>
            <td>The HTML attribute on the tab to get the URL for AJAX requests.</td>
        </tr>
        <tr>
            <td>loadFragment</td>
            <td>bool</td>
            <td>true</td>
            <td>Open the section that matches the current hash fragment.</td>
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
            <td>persistState</td>
            <td>bool</td>
            <td>false</td>
            <td>Persist the open tab between requests through cookies.</td>
        </tr>
        <tr>
            <td>preventDefault</td>
            <td>bool</td>
            <td>true</td>
            <td>Prevent the default action on navigation tabs.</td>
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
            <td>load</td>
            <td>string:response</td>
            <td>Triggered when a section is loaded via AJAX.</td>
        </tr>
        <tr>
            <td>showing</td>
            <td>int:oldIndex</td>
            <td>Triggered before the section is shown.</td>
        </tr>
        <tr>
            <td>shown</td>
            <td>int:newIndex</td>
            <td>Triggered after the section is shown.</td>
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
            <td>cache</td>
            <td>object</td>
            <td>Collection of cached AJAX requests indexed by URL.</td>
            <td></td>
        </tr>
        <tr>
            <td>index</td>
            <td>int</td>
            <td>The index of the currently opened section.</td>
            <td></td>
        </tr>
        <tr>
            <td>nav</td>
            <td>element</td>
            <td>The element containing the navigation links (the tabs).</td>
            <td>[data-tab-nav]</td>
        </tr>
        <tr>
            <td>sections</td>
            <td>collection</td>
            <td>A collection of section elements within the tab wrapper.</td>
            <td>[data-tab-section]</td>
        </tr>
        <tr>
            <td>tabs</td>
            <td>collection</td>
            <td>A collection of tab elements within the nav.</td>
            <td>[data-tab-nav] a</td>
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
            <td>jump(int:index)</td>
            <td>Open a specific section using the index in the collection.</td>
            <td></td>
        </tr>
        <tr>
            <td>show(element:tab)</td>
            <td>Open a specific section using the related tab element.</td>
            <td>[data-tab-nav] a</td>
        </tr>
    </tbody>
</table>
