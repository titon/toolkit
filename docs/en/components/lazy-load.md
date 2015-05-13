# Lazy Load #

Defer loading of images and elements until they scroll into view.

## Usage ##

The lazy load component makes it easy to defer loading of an image until it scrolls into view &mdash; which applies to inline and background images. This is especially useful in reducing the amount of HTTP requests in a given page.

The difference between this component, and other libraries, is that lazy loading is applied to a parent wrapper. There are 2 reasons for this, the first is that it allows deferred loading of background images (ones defined in CSS), and the second is bulk loading of `img`s within the element. Simply place a `.lazy-load` (or the value of `lazyClass`) class on the element we want to monitor.

```html
<div class="item lazy-load">
    <img data-src="/img/image.png" alt="">
</div>
```

<div class="notice is-info">
    When lazy loading inline images, use the <code>data-src</code> attribute instead of <code>src</code>.
</div>

Once elements have been marked, the component can be initialized on a parent container.

```javascript
$('body').lazyLoad();

// Or an element with overflow hidden
$('#overflown').lazyLoad();
```

<div class="notice is-info">
    Lazy loading should be initialized without DOM ready, but after lazy elements have been declared, so that images don't flicker.
</div>

### Retina Support ###

To display a higher quality image for retina/HD displays, use `data-src-retina`. If no retina equivalent is found, it will fallback to `data-src`.

```html
<div class="item lazy-load">
    <img data-src="/img/image.png" data-src-retina="/img/image-hd.png" alt="">
</div>
```

### Scrolling Threshold ###

When no threshold is set, images will immediately load when they appear on screen. Defining a threshold (in pixels) will start pre-loading any images that appear outside the viewport.

```javascript
$('body').lazyLoad({
    threshold: 200 // load images 200px off screen (default is 150)
});
```

### Flicker Prevention ###

By default, all inline images will be collapsed before being loaded. Because of this, a flicker or element shift may occur once the image is loaded. To prevent this, define a width and height for the image, either inline or through CSS. We may also define the `src` attribute with a transparent fill-in image.

```html
<img src="/img/fake-image.png" data-src="/img/real-image.png" width="250" height="100">
```

### Notes ###

* Background images will be overridden by the `.lazy-load` class.
* Elements that have been loaded will have the `.lazy-load` class removed.

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
            <td>$lazyLoad-class</td>
            <td>.lazy-load</td>
            <td>CSS class name for the individual lazy load element.</td>
        </tr>
        <tr>
            <td>$lazyLoad-transition</td>
            <td>.3s</td>
            <td>The transition time for fading background images in and out.</td>
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
            <td>delay</td>
            <td>int</td>
            <td>10000</td>
            <td>The number of milliseconds to wait before force loading all images.</td>
        </tr>
        <tr>
            <td>forceLoad</td>
            <td>bool</td>
            <td>false</td>
            <td>Force the loading of all images once the <code>delay</code> has passed.</td>
        </tr>
        <tr>
            <td>lazyClass</td>
            <td>string</td>
            <td>.lazy-load</td>
            <td>The class name to search for and to remove while loading.</td>
        </tr>
        <tr>
            <td>threshold</td>
            <td>int</td>
            <td>150</td>
            <td>The distance in pixels near the edge of the viewport to start pre-loading images.</td>
        </tr>
        <tr>
            <td>throttle</td>
            <td>int</td>
            <td>50</td>
            <td>The number of milliseconds to throttle all loading events.</td>
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
            <td>loading</td>
            <td></td>
            <td>Triggered before scrolling or resizing to check for elements to load.</td>
        </tr>
        <tr>
            <td>loaded</td>
            <td></td>
            <td>Triggered after scrolling or resizing to check for elements to load.</td>
        </tr>
        <tr>
            <td>loadAll</td>
            <td></td>
            <td>Triggered when elements have been force loaded.</td>
        </tr>
        <tr>
            <td>showing</td>
            <td>element:element</td>
            <td>Triggered before an element (that may contain images) is lazy loaded.</td>
        </tr>
        <tr>
            <td>shown</td>
            <td>element:element</td>
            <td>Triggered after an element is lazy loaded.</td>
        </tr>
        <tr>
            <td>shutdown</td>
            <td></td>
            <td>Triggered when all elements have been loaded, or when <code>shutdown()</code> is called.</td>
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
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>container</td>
            <td>element</td>
            <td>The element to monitor scroll events on.</td>
        </tr>
        <tr>
            <td>element</td>
            <td>element</td>
            <td>The element currently being loaded.</td>
        </tr>
        <tr>
            <td>items</td>
            <td>collection</td>
            <td>
                A collection of elements to load.
                These elements are found using the query that instantiated the component.
            </td>
        </tr>
        <tr>
            <td>loaded</td>
            <td>int</td>
            <td>A count of how many elements have been loaded.</td>
        </tr>
        <tr>
            <td>timer</td>
            <td>int</td>
            <td>The load all timer.</td>
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
            <td>inViewport(element:element)</td>
            <td>Check to see if an element is within the viewport or within the threshold.</td>
        </tr>
        <tr>
            <td>load()</td>
            <td>Attempt to load any elements that are off screen but within the threshold.</td>
        </tr>
        <tr>
            <td>loadAll()</td>
            <td>Force load all elements regardless of where they are in the page.</td>
        </tr>
        <tr>
            <td>shutdown()</td>
            <td>Remove all loading events and disable the component. This will not load elements that have not been loaded.</td>
        </tr>
    </tbody>
</table>
