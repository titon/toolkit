# Tabs #

Organizes multiple sections of content into toggleable tabs.

## Usage ##

The tabs component is primarily used in the display of multiple sections of content,
with only a single section open at any time, all toggled through a navigation of tabbed links.

The tabs that make up the component should be wrapped in a `.tabs-nav` and structured with
a required `ul` list. The sections that associate to tabs should be created with `.tabs-section`.

```html
<div class="tabs">
    <nav class="tabs-nav">
        <ul>
            <li><a href="#one">First</a></li>
            <li><a href="#two">Second</a></li>
            <li><a href="#three">Third</a></li>
        </ul>
    </nav>

    <section class="tabs-section">...</section>
    <section class="tabs-section">...</section>
    <section class="tabs-section">...</section>
</div>
```

The component should be initialized on an element that wraps both the navigation and the sections.

```javascript
$('.tabs').tabs();
```

<div class="notice is-info">
    The markup for tabs can be customized and re-arranged extensively.
    The only requirements are the inclusion of tab classes.
</div>

<div class="notice is-warning">
    The <code>href</code> of every tab does <b>not</b> point to a section ID.
    For every tab, there needs to be an associated section in the markup, even if it's empty.
    The order and index in the collection determines association.
</div>

### Horizontal Tabs ###

To display tabs horizontally alongside sections, and to update all navigation items to a vertical layout,
use `.tabs--horizontal`. We suggest pairing this with the [Grid component](grid.md).

```html
<div class="tabs--horizontal grid">
    <nav class="tabs-nav col span-4">
        <ul>
            <li><a href="#one">First</a></li>
            <li><a href="#two">Second</a></li>
            <li><a href="#three">Third</a></li>
        </ul>
    </nav>

    <div class="col span-8">
        <section class="tabs-section">...</section>
        <section class="tabs-section">...</section>
        <section class="tabs-section">...</section>
    </div>
</div>
```

### Persist State ###

There are 2 ways to persist the open section between requests.
The first, which also takes highest priority, is through cookies.

```javascript
$('.tabs').tabs({
    persistState: true,
    cookie: 'foobar'
});
```

The second is through the hash fragment in the URL.
We can either update the hash manually when a tab is clicked,
or disable `preventDefault` and set the `href` to IDs.

```javascript
$('.tabs').tabs({
    loadFragment: true,
    preventDefault: false
});
```

Lastly, if neither of those states are persisted, then the `defaultIndex` will be used.

### AJAX Loading ###

Loading in sections through AJAX is extremely easy, simply enable the `ajax` option (is enabled by default).

```javascript
$('.tabs').tabs({
    ajax: true
});
```

Then replace the `href` on the tabs with the URL we want to request via AJAX.

```html
<div class="tabs">
    <nav class="tabs-nav">
        <ul>
            <li><a href="/load/this">AJAX 1st</a></li>
            <li><a href="/load/that">AJAX 2nd</a></li>
            <li><a href="#three">Non-AJAX</a></li>
        </ul>
    </nav>

    <section class="tabs-section"></section>
    <section class="tabs-section"></section>
    <section class="tabs-section">...</section>
</div>
```

If the `ajax` option is false, but we still want to load in content for a specific tab,
we can override the `ajax` option through data attributes.

```html
<a href="/load/this" data-tabs-ajax="true">AJAX Override</a>
```

<div class="notice is-warning">
    Be sure to create empty sections to insert the response into,
    as the component does not automatically create them!
</div>

### Notes ###

* The `.show` and `.hide` classes will be toggled on the `.tabs-section` to trigger display.
* The currently open section will have an `.is-active` class on the tabs parent `li`.

## ARIA ##

The `tab`, `tablist`, and `tabpanel` roles, and the appropriate `aria-*`
attributes are required when supporting ARIA.

```html
<div class="tabs">
    <nav class="tabs-nav" role="tablist">
        <ul>
            <li><a href="#one" role="tab">First</a></li>
        </ul>
    </nav>

    <section class="tabs-section" role="tabpanel">...</section>
</div>
```

<div class="notice is-info">
    The JavaScript component will automatically map all ARIA attributes.
</div>

## Options ##

Inherits all options from the [parent component](../development/js/component.md#options).

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
            <td>mode</td>
            <td>string</td>
            <td>click</td>
            <td>
                The type of interaction for toggling a section.
                Accepts click or hover.
            </td>
        </tr>
        <tr>
            <td>ajax</td>
            <td>bool</td>
            <td>true</td>
            <td>Support loading in sections through AJAX calls.</td>
        </tr>
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
            <td>
                The index of the section to open on page load.
                Can be overridden by a fragment or cookie.
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
        <tr>
            <td>loadFragment</td>
            <td>bool</td>
            <td>true</td>
            <td>Open the section that matches the current hash fragment.</td>
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
            <td>getUrl</td>
            <td>string</td>
            <td>url</td>
            <td>The HTML attribute on the tab to get the URL for AJAX requests.</td>
        </tr>
    </tbody>
</table>

## Events ##

Inherits all events from the [parent component](../development/js/component.md#events).

## Properties ##

Inherits all properties from the [parent component](../development/js/component.md#properties).

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
            <td>nav</td>
            <td>element</td>
            <td>The element containing the navigation links (the tabs).</td>
            <td>.tabs-nav</td>
        </tr>
        <tr>
            <td>tabs</td>
            <td>collection</td>
            <td>A collection of tab elements within the nav.</td>
            <td>.tabs-nav a</td>
        </tr>
        <tr>
            <td>sections</td>
            <td>collection</td>
            <td>A collection of section elements within the tab wrapper.</td>
            <td>.tabs-section</td>
        </tr>
        <tr>
            <td>index</td>
            <td>int</td>
            <td>The index of the currently opened section.</td>
            <td></td>
        </tr>
        <tr>
            <td>cache</td>
            <td>object</td>
            <td>Collection of cached AJAX requests indexed by URL.</td>
            <td></td>
        </tr>
    </tbody>
</table>

## Methods ##

Inherits all methods from the [parent component](../development/js/component.md#methods).

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
            <td>.tabs-nav a</td>
        </tr>
    </tbody>
</table>
