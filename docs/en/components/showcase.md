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

### Notes ###

* A `.is-loading` class will be added to the showcase wrapper while images are loading.
* A `.is-active` class will be added to the currently active tab.
* A `.show` class will be added to the `li` for the item currently being show.
* Supports arrow and escape key events.

## Template ##

The following markup is used for the creation of showcases.
This structure can be customized through the `template` option.

```html
<div class="showcase">
    <div class="showcase-inner">
        <ul class="showcase-items"></ul>
        <ol class="showcase-tabs bullets"></ol>

        <button class="showcase-prev"><span class="arrow-left"></span></button>
        <button class="showcase-next"><span class="arrow-right"></span></button>
    </div>

    <button class="showcase-close showcase-hide"><span class="x"></span></button>
    <div class="showcase-caption"></div>
</div>
```

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
        <tr>
            <td>$showcase-zindex</td>
            <td>610</td>
            <td>The z-index for the showcase element.</td>
        </tr>
    </tbody>
</table>

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
    </tbody>
</table>

## Events ##

Inherits all events from the [parent component](../development/js/component.md#events).

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
            <td>data</td>
            <td>array</td>
            <td>A list of data for titles, images, and categories. This list changes each time the showcase opens.</td>
            <td></td>
        </tr>
        <tr>
            <td>items</td>
            <td>element</td>
            <td>The element that contains all items.</td>
            <td>.showcase-items</td>
        </tr>
        <tr>
            <td>tabs</td>
            <td>element</td>
            <td>The element that contains all tabs &mdash; the list of bullets to jump between pages.</td>
            <td>.showcase-tabs</td>
        </tr>
        <tr>
            <td>caption</td>
            <td>element</td>
            <td>The element that contains the current item caption.</td>
            <td>.showcase-caption</td>
        </tr>
        <tr>
            <td>index</td>
            <td>int</td>
            <td>The index of the currently shown item.</td>
            <td></td>
        </tr>
        <tr>
            <td>blackout</td>
            <td>object</td>
            <td>The <code>Toolkit.Blackout</code> instance when <code>blackout</code> is enabled.</td>
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
            <td>hide()</td>
            <td>Hide the showcase.</td>
            <td>.showcase-hide</td>
        </tr>
        <tr>
            <td>jump(int:index)</td>
            <td>Show a specific item defined by the index in the collection.</td>
            <td>.showcase-tabs a</td>
        </tr>
        <tr>
            <td>next()</td>
            <td>Go to the next item.</td>
            <td>.showcase-next</td>
        </tr>
        <tr>
            <td>prev()</td>
            <td>Go to the previous item.</td>
            <td>.showcase-prev</td>
        </tr>
        <tr>
            <td>show(element:node)</td>
            <td>Show the showcase and gather items based on the clicked node.</td>
            <td><code>selector</code></td>
        </tr>
    </tbody>
</table>