# Flyout #

Hierarchical sitemap through nested menus.

## Usage ##

Generation of flyout menus require a nested JSON structure of pages found within a website, usually akin to a sitemap. Each item in the data set requires a title, an optional URL, and a list of children.

```javascript
{
    title: 'Home',
    url: '/',
    children: [
        {
            title: 'News',
            url: '/news',
        }, {
            title: 'Users',
            url: '/users',
            children: [
                ...
            ]
        }
    ]
}
```

The top level object will always be the root index or home page, while all other pages will be nested within `children`. For the flyout to function correctly, the data set is required during initialization. This can be accomplished by providing a URL that returns a JSON response as the 1st argument. Options are passed as the 2nd argument.

```javascript
$('.js-flyout a').flyout('/sitemap');
```

The flyout component must be initialized on an element that returns a target URL. This URL determines the list of items to display in the flyout menu by looking through the data set listed above. A great use case for flyouts is binding them to links within a breadcrumb.

```html
<nav class="breadcrumb js-flyout">
    <ol>
        <li><a href="/">Home <span class="caret">/</span></a></li>
        <li><a href="/users">Users <span class="caret">/</span></a></li>
        <li><a href="/users/search">Search <span class="caret">/</span></a></li>
    </ol>
</nav>
```

Now anytime we hover (or click depending on configuration) an anchor link within the breadcrumb, a flyout menu will appear for all items found within that URL. If we use the example data above, hovering over Home will display a menu with News and Users, while hovering over Users will display all items within its `children`, so on and so forth.

### Headers ###

To group items with an unlinkable header, simply pass in an item with no URL.

```javascript
{
    title: 'Group'
}
```

Which in turn, will produce a heading within the menu.

```html
<li class="flyout-heading">
    <span>Group</span>
</li>
```

### Data Structure ###

The following fields are available for each item in the data set.

<table class="table is-striped data-table">
    <thead>
        <tr>
            <th>Field</th>
            <th>Type</th>
            <th>Default</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>title</td>
            <td>string</td>
            <td></td>
            <td>The title for the item within the menu.</td>
        </tr>
        <tr>
            <td>url</td>
            <td>string</td>
            <td></td>
            <td>The URL to link an item to. If no URL is provided, a heading is created.</td>
        </tr>
        <tr>
            <td>icon</td>
            <td>string</td>
            <td>.caret-right</td>
            <td>The class name to apply to the icon used to indicate a nested menu.</td>
        </tr>
        <tr>
            <td>className</td>
            <td>string</td>
            <td></td>
            <td>The class name to apply to the parent <code>li</code>.</td>
        </tr>
        <tr>
            <td>attributes</td>
            <td>object</td>
            <td></td>
            <td>An object of HTML attributes to set on the item.</td>
        </tr>
    </tbody>
</table>

### Notes ###

* Top level menus will have an `.is-root` class.
* Nested menus will have an `.has-children` class on the parent `li`.
* If a menu extends outside the viewport, a `.push-left` class will be applied to shift it in the opposite direction.

## ARIA ##

The `menu` and `menuitem` roles, and the appropriate `aria-*` attributes are required when supporting ARIA.

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
            <td>$flyout-class</td>
            <td>.flyout</td>
            <td>CSS class name for the flyout wrapper.</td>
        </tr>
        <tr>
            <td>$flyout-class-heading</td>
            <td>.flyout-heading</td>
            <td>CSS class name for the flyout heading element.</td>
        </tr>
        <tr>
            <td>$flyout-transition</td>
            <td>.3s</td>
            <td>The transition time for menu fade and nested menu slide animations.</td>
        </tr>
        <tr>
            <td>$flyout-zindex</td>
            <td>600</td>
            <td>The z-index for the flyout element.</td>
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
            <td>getUrl</td>
            <td>string|function</td>
            <td>href</td>
            <td>
                If a string is passed, fetch the URL from the HTML attribute.
                If a function is passed, use the return value as the URL.
                The URL should match an index in the JSON response.
            </td>
        </tr>
        <tr>
            <td>headingTemplate</td>
            <td>string</td>
            <td>
                &lt;li class="flyout-heading"&gt;&lt;/li&gt;
            </td>
            <td>The heading markup for list items.</td>
        </tr>
        <tr>
            <td>hideDelay</td>
            <td>int</td>
            <td>1000</td>
            <td>The delay in milliseconds before the flyout is hidden.</td>
        </tr>
        <tr>
            <td>itemLimit</td>
            <td>int</td>
            <td>15</td>
            <td>The number of items per list in a flyout menu.</td>
        </tr>
        <tr>
            <td>mode</td>
            <td>string</td>
            <td>hover</td>
            <td>
                The type of interaction for displaying a flyout.
                Accepts click or hover.
            </td>
        </tr>
        <tr>
            <td>showDelay</td>
            <td>int</td>
            <td>350</td>
            <td>The delay in milliseconds before the flyout is displayed.</td>
        </tr>
        <tr>
            <td>template</td>
            <td>string</td>
            <td>
                &lt;div class="flyout" data-flyout-menu&gt;&lt;/div&gt;
            </td>
            <td>The flyout markup. The <code>data-flyout-menu</code> is required.</td>
        </tr>
        <tr>
            <td>wrapperClass</td>
            <td>string</td>
            <td>flyouts</td>
            <td>The class name to set on the composite wrapper.</td>
        </tr>
        <tr>
            <td>xOffset</td>
            <td>int</td>
            <td>0</td>
            <td>The offset in pixels to move the flyout along the X axis.</td>
        </tr>
        <tr>
            <td>yOffset</td>
            <td>int</td>
            <td>0</td>
            <td>The offset in pixels to move the flyout along the Y axis.</td>
        </tr>
    </tbody>
</table>

## Events ##

Inherits all events from the [parent Component](component.md#events).

<table class="table is-striped data-table">
    <thead>
        <tr>
            <th>Event</th>
            <th>Arguments</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>hideChild</td>
            <td>element:parent</td>
            <td>Triggered when a nested flyout menu is hidden. The parent <code>li</code> is passed as an argument.</td>
        </tr>
        <tr>
            <td>showChild</td>
            <td>element:parent</td>
            <td>Triggered when a nested flyout menu is shown. The parent <code>li</code> is passed as an argument.</td>
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
            <td>data</td>
            <td>json</td>
            <td>The raw JSON response from the initial AJAX request.</td>
        </tr>
        <tr>
            <td>dataMap</td>
            <td>object</td>
            <td>A mapping of data objects indexed by URL.</td>
        </tr>
        <tr>
            <td>timers</td>
            <td>object</td>
            <td>A mapping of show and hide timers.</td>
        </tr>
        <tr>
            <td>url</td>
            <td>string</td>
            <td>The current URL being used for display.</td>
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
            <td>load(data)</td>
            <td>
                Load data into the flyout and create a mapping by URL.
                This method is automatically triggered through the initial AJAX request.
            </td>
            <td></td>
        </tr>
        <tr>
            <td>show()</td>
            <td>Show the flyout defined by the current node URL.</td>
            <td><code>selector</code></td>
        </tr>
    </tbody>
</table>
