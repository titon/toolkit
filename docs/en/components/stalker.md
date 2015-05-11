# Stalker #

Monitors the scroll of an element and notifies a target when a marker is reached.

## Usage ##

A stalker can automatically update a target based on the position of the scrollbar and the monitoring of markers within the page. This is especially useful for navigation items that need to update based on the content currently in view. Take the following for example.

```html
<div class="wrapper">
    <aside id="nav">
        <a href="#one">First</a>
        <a href="#two">Second</a>
        <a href="#three">Third</a>
    </aside>

    <section id="articles">
        <article id="one">...</article>
        <article id="two">...</article>
        <article id="three">...</article>
    </section>
</div>
```

What we want to do is update the navigation items when an article is scrolled into view. We can instantiate a stalker using the targets in the navigation, and the markers in the articles list.

```javascript
$('body').stalker({
    target: '#nav a',
    marker: '#articles article'
});
```

Markers and targets will be matched based on the value of the `targetBy` and `markBy` options. By default this matches the ID of the marker against the href of the target.

### Overflow Containers ###

A stalker can also monitor an element that has overflow `auto`. Simply pass the overflown element as the constructor.

```javascript
$('#overflown').stalker({
    ...
});
```

### Notes ###

* The active target will have an `.is-active` class added.
* The marker in view will have an `.is-stalked` class added.
* Markers and targets can be placed anywhere in the page.

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
            <td>onlyWithin</td>
            <td>bool</td>
            <td>true</td>
            <td>
                Whether to activate or deactivate a target while within a marker.
                If disabled, the target will stay activated even after leaving the marker.
            </td>
        </tr>
        <tr>
            <td>marker</td>
            <td>string</td>
            <td></td>
            <td>CSS selector for elements to mark and monitor during page scroll.</td>
        </tr>
        <tr>
            <td>markBy</td>
            <td>string</td>
            <td>id</td>
            <td>The HTML attribute on the marker to match against the target.</td>
        </tr>
        <tr>
            <td>target</td>
            <td>string</td>
            <td></td>
            <td>CSS selector for elements to update when a marker is reached.</td>
        </tr>
        <tr>
            <td>targetBy</td>
            <td>string</td>
            <td>href</td>
            <td>The HTML attribute on the target to match against the marker.</td>
        </tr>
        <tr>
            <td>threshold</td>
            <td>int</td>
            <td>50</td>
            <td>The distance in pixels between the viewport edge and the marker to trigger activation.</td>
        </tr>
        <tr>
            <td>throttle</td>
            <td>int</td>
            <td>50</td>
            <td>The number of milliseconds to throttle all scrolling events.</td>
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
            <td>activating</td>
            <td>element:marker, element:target</td>
            <td>Triggered before a marker is entered and a target is activated.</td>
        </tr>
        <tr>
            <td>activated</td>
            <td>element:marker, element:target</td>
            <td>Triggered after a marker is entered and a target is activated.</td>
        </tr>
        <tr>
            <td>deactivating</td>
            <td>element:marker, element:target</td>
            <td>Triggered before a marker is exited and a target is deactivated.</td>
        </tr>
        <tr>
            <td>deactivated</td>
            <td>element:marker, element:target</td>
            <td>Triggered after a marker is exited and a target is deactivated.</td>
        </tr>
        <tr>
            <td>scroll</td>
            <td></td>
            <td>Triggered every page scroll after markers have been processed.</td>
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
            <td>container</td>
            <td>element</td>
            <td>
                The element to monitor scroll events on.
                If the element has overflow auto, it will be the constructor element, else it will be the window.
            </td>
            <td></td>
        </tr>
        <tr>
            <td>markers</td>
            <td>collection</td>
            <td>A collection of marker elements to monitor and notify against.</td>
            <td><code>marker</code> option</td>
        </tr>
        <tr>
            <td>offsets</td>
            <td>array</td>
            <td>A list of top and left offsets for all markers. These offsets are used for monitoring the scroll.</td>
            <td></td>
        </tr>
        <tr>
            <td>targets</td>
            <td>collection</td>
            <td>A collection of target elements to activate.</td>
            <td><code>target</code> option</td>
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
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>activate(element:marker)</td>
            <td>
                Manually set the active target based on the marker.
                Is automatically called through scroll monitoring events.
            </td>
        </tr>
        <tr>
            <td>deactivate(element:marker)</td>
            <td>
                Manually remove the active target based on the marker.
                Is automatically called through scroll monitoring events.
            </td>
        </tr>
        <tr>
            <td>refresh()</td>
            <td>
                Refresh the target and marker collections, and re-calculate offsets.
                Should rarely need to be called.
            </td>
        </tr>
    </tbody>
</table>
