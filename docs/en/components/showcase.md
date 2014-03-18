# Showcase #

Lightbox styled image gallery with optional categorization.

## Usage ##

A showcase can be used for displaying higher quality or larger scaled images than what can be placed in the page.
Showcases support single viewing, multiple viewing through categorization, and optional captions.

The showcase component must be initialized on an element that will trigger the display of the showcases, for example.

```html
<a href="/img/large.png" class="js-showcase">
    <img src="/img/large-thumb.png" alt="">
</a>
```

```javascript
$('.js-showcase').showcase();
```

When the target is clicked, the value of `getImage` (defaults to `href`) will be used as the image URL,
and the value of `getTitle` (defaults to `title`) will be used as the caption.

### Category Grouping ###

To display multiple images that can be cycled through, a category must be defined.
This category will group all images into the same showcase.

```html
<a href="/img/large-1.png" class="js-showcase" title="1st image" data-showcase="category">
    <img src="/img/large-1-thumb.png" alt="">
</a>

<a href="/img/large-2.png" class="js-showcase" title="2nd image" data-showcase="category">
    <img src="/img/large-2-thumb.png" alt="">
</a>
```

The value of `getCategory` (defaults to `data-showcase`) will be used for grouping.

## Notes ##

* A `.is-loading` class will be added to the showcase wrapper while images are loading.
* A `.is-active` class will be added to the currently active tab.
* A `.show` class will be added to the `li` for the item currently being show.
* Supports arrow and escape key events.

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
            <td>$showcase-opacity</td>
            <td>0.50</td>
            <td>The alpha transparency for the showcase caption element.</td>
        </tr>
        <tr>
            <td>$showcase-transition</td>
            <td>.3s</td>
            <td>The transition time for showcase resize animations.</td>
        </tr>
    </tbody>
</table>

## Options ##

Inherits all options from the [parent component](../development/js.md#options).

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
            <td>blackout</td>
            <td>bool</td>
            <td>true</td>
            <td>Whether to display a blackout when a showcase is open.</td>
        </tr>
        <tr>
            <td>stopScroll</td>
            <td>bool</td>
            <td>true</td>
            <td>Whether to remove the scrollbar on the window while the showcase is open.</td>
        </tr>
        <tr>
            <td>transition</td>
            <td>int</td>
            <td>30</td>
            <td>
                Transition time in milliseconds to wait between each item load.
                Should only change if the width and height transition times have changed in CSS.
            </td>
        </tr>
        <tr>
            <td>gutter</td>
            <td>int</td>
            <td>50</td>
            <td>The margin in pixels to leave between the showcase and viewport edge.</td>
        </tr>
        <tr>
            <td>getCategory</td>
            <td>string</td>
            <td>data-showcase</td>
            <td>The attribute to read and categorize items in the showcase with.</td>
        </tr>
        <tr>
            <td>getImage</td>
            <td>string</td>
            <td>href</td>
            <td>The attribute to read the image URL from.</td>
        </tr>
        <tr>
            <td>getTitle</td>
            <td>string</td>
            <td>title</td>
            <td>The attribute to read the image title from.</td>
        </tr>
        <tr>
            <td>itemsElement</td>
            <td>string</td>
            <td>.showcase-items</td>
            <td>CSS selector to find the items container element.</td>
        </tr>
        <tr>
            <td>tabsElement</td>
            <td>string</td>
            <td>.showcase-tabs</td>
            <td>CSS selector to find the tabs container element (a list of bullets).</td>
        </tr>
        <tr>
            <td>nextElement</td>
            <td>string</td>
            <td>.showcase-next</td>
            <td>CSS selector to find the next item button.</td>
        </tr>
        <tr>
            <td>prevElement</td>
            <td>string</td>
            <td>.showcase-prev</td>
            <td>CSS selector to find the previous item button.</td>
        </tr>
        <tr>
            <td>closeEvent</td>
            <td>string</td>
            <td>.showcase-event-close</td>
            <td>CSS selector to bind close events to.</td>
        </tr>
        <tr>
            <td>nextEvent</td>
            <td>string</td>
            <td>.showcase-event-next</td>
            <td>CSS selector to bind next item events to.</td>
        </tr>
        <tr>
            <td>prevEvent</td>
            <td>string</td>
            <td>.showcase-event-prev</td>
            <td>CSS selector to bind previous item events to.</td>
        </tr>
    </tbody>
</table>

## Template ##

The following markup is used for the creation of showcases.
This structure can be customized through the `template` option.

```html
<div class="showcase">
    <div class="showcase-inner">
        <ul class="showcase-items"></ul>
        <ol class="showcase-tabs bullets"></ol>

        <button type="button" class="showcase-prev showcase-event-prev"><span class="arrow-left"></span></button>
        <button type="button" class="showcase-next showcase-event-next"><span class="arrow-right"></span></button>
        <button type="button" class="showcase-close showcase-event-close"><span class="x"></span></button>
    </div>
</div>
```

## Events ##

Inherits all events from the [parent component](../development/js.md#events).

<table class="table is-striped data-table">
    <thead>
        <tr>
            <th>Option Event</th>
            <th>Element Event</td>
            <th>Arguments</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>onJump</td>
            <td>jump.toolkit.showcase</td>
            <td>int:index</td>
            <td>Triggered after an item is cycled into view. Applies to all next, previous, and cycle calls.</td>
        </tr>
    </tbody>
</table>

## Properties ##

Inherits all properties from the [parent component](../development/js.md#properties).

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
            <td>data</td>
            <td>array</td>
            <td>A list of data for titles, images, and categories. This list changes each time the showcase opens.</td>
        </tr>
        <tr>
            <td>items</td>
            <td>element</td>
            <td>
                The element that contains all items.
                This element is found using the <code>itemsElement</code> option.
            </td>
        </tr>
        <tr>
            <td>tabs</td>
            <td>element</td>
            <td>
                The element that contains all tabs &mdash; the list of bullets to jump between pages.
                This element is found using the <code>tabsElement</code> option.
            </td>
        </tr>
        <tr>
            <td>nextButton</td>
            <td>element</td>
            <td>
                The element that when clicked will jump to the next item.
                This element is found using the <code>nextElement</code> option.
            </td>
        </tr>
        <tr>
            <td>prevButton</td>
            <td>element</td>
            <td>
                The element that when clicked will jump to the previous item.
                This element is found using the <code>prevElement</code> option.
            </td>
        </tr>
        <tr>
            <td>index</td>
            <td>int</td>
            <td>The index of the currently shown item.</td>
        </tr>
        <tr>
            <td>blackout</td>
            <td>object</td>
            <td>The <code>Toolkit.Blackout</code> instance when <code>blackout</code> is enabled.</td>
        </tr>
    </tbody>
</table>

## Methods ##

Inherits all methods from the [parent component](../development/js.md#methods).

<table class="table is-striped data-table">
    <thead>
        <tr>
            <th>Method</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>jump(int:index)</td>
            <td>
                Show a specific item defined by the index in the collection.
                If the index is out of range, it will be bounded.
                This method is triggered automatically when a tab is clicked.
            </td>
        </tr>
        <tr>
            <td>next()</td>
            <td>
                Go to the next item.
                This method is triggered automatically when the next button is clicked.
            </td>
        </tr>
        <tr>
            <td>prev()</td>
            <td>
                Go to the previous item.
                This method is triggered automatically when the previous button is clicked.
            </td>
        </tr>
    </tbody>
</table>