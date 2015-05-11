# Type Ahead #

Monitors an input field and triggers a lookup of data to render in a clickable menu.

## Usage ##

A type ahead (also known as an autocomplete) attempts to predict and suggest a list of items based on the current input from a user. The data used to generate suggestions can be packaged in multiple ways, as well as be sorted and grouped.

A type ahead component must be initialized on an input field, so that key press events can be monitored.

```html
<input type="text" id="input" class="input" name="term">
```

```javascript
$('#input').typeAhead();
```

<div class="notice is-warning">
    A data source must be defined to query against. Continue reading for more information on data sources.
</div>

### Data Source ###

There are 3 ways to retrieve data for the lookup system. The first is through a literal array, which will be used as the data.

```javascript
$('#input').typeAhead({
    source: [
        { title: 'Finn', description: 'Hero' },
        { title: 'Jake' },
        { title: 'Princess Bubblegum' }
    ]
});
```

The second is through a function, which should return an array of data.

```javascript
$('#input').typeAhead({
    source: function() {
        return [
            ...
        ];
    }
});
```

The third is through a string, which should point to a URL to query against. This URL will be requested on every lookup unless `prefetch` is enabled. More information on pre-fetching can be found in the next chapter.

```javascript
$('#input').typeAhead({
    source: '/api/search'
});
```

<div class="notice is-info">
    When using the remote HTTP request approach, we suggest that sorting, matching, and filtering be done on the remote end, and <code>sorter</code> and <code>matcher</code> be set to <code>false</code> on the front end.
</div>

#### Category Grouping ####

Items can be grouped and rendered into categories by defining the `category` field in the data set.

```javascript
return [
   { title: 'Finn', category: 'Adventurer', description: 'Hero' },
   { title: 'Jake', category: 'Adventurer' },
   { title: 'Princess Bubblegum', category: 'Princess' },
   { title: 'Lumpy Space Princess', category: 'Princess' },
]
```

#### Data Structure ####

The following fields are available for each item in the data set. Custom fields can also be defined and used within `builder` callbacks, and when an item is selected.

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
            <td>description</td>
            <td>string</td>
            <td></td>
            <td>An optional description for the item.</td>
        </tr>
        <tr>
            <td>category</td>
            <td>string</td>
            <td></td>
            <td>An optional category to group items.</td>
        </tr>
    </tbody>
</table>

### Prefetching ###

When `prefetch` is enabled, data will be fetched and processed on initialization, which will prevent additional HTTP requests for every lookup. Fetching will use the `source` option as the URL to request, and the JSON response as the data.

```javascript
$('#input').typeAhead({
    source: '/api/data',
    prefetch: true
});
```

### Shadow Text ###

The shadow text feature will display the title behind the input field, for the first item in the data set if it matches the current term. For a better understanding of how this works, take a look at Google search.

```javascript
$('#input').typeAhead({
    shadow: true
});
```

When enabled, the input markup will be changed to the following.

```html
<div class="type-ahead-shadow">
    <!-- The shadow input -->
    <input type="text" class="input is-shadow" readonly>
    <!-- The original input -->
    <input type="text" id="input" class="input not-shadow">
</div>
```

### Sorters, Matchers & Builders ###

Custom sorter, matcher, and builder functions can be defined to modify and hook into the type ahead process. If no function is defined, it will fall back to the class implementation.

The sorter receives an array of items, and should return the array sorted.

```javascript
function sort(items) {
    return items.sort();
}
```

The matcher receives an item title and the current term, and should return a boolean if a match is found.

```javascript
function match(item, term) {
    return (item.title.indexOf(term) >= 0);
}
```

The builder receives an item object, and should return an element to render in the dropdown menu.

```javascript
function build(item) {
    return $('<a/>', {
        href: 'javascript:;',
        html: this.highlight(item.title)
    });
}
```

Once our functions are defined, we pass them through the constructor.

```javascript
$('#input').typeAhead({
    sorter: sort,
    matcher: match,
    builder: build
});
```

<div class="notice is-info">
    The "this" context for all callbacks point to the type ahead instance.
</div>

<div class="notice is-info">
    If <code>false</code> is defined for an option, no callback or fallback will be used. This is useful for data sets that are processed remotely.
</div>

### Notes ###

* The currently selected item in the list will have an `.is-active` class on the parent `li`.

## ARIA ##

The `combobox`, `listbox`, and `option` roles, and the appropriate `aria-*` attributes are required when supporting ARIA.

```html
<input type="text" id="input" class="input" name="term" role="combobox" aria-autocomplete="off">

<div class="type-ahead" role="listbox">
    <ul>
        <li><a href="javascript:;" role="option">Item</a></li>
    </ul>
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
            <td>$typeAhead-class</td>
            <td>.type-ahead</td>
            <td>CSS class name for the type ahead wrapper.</td>
        </tr>
        <tr>
            <td>$typeAhead-class-description</td>
            <td>.type-ahead-desc</td>
            <td>CSS class name for the type ahead item description element.</td>
        </tr>
        <tr>
            <td>$typeAhead-class-highlight</td>
            <td>.type-ahead-highlight</td>
            <td>CSS class name for the highlighted term in the type ahead list.</td>
        </tr>
        <tr>
            <td>$typeAhead-class-heading</td>
            <td>.type-ahead-heading</td>
            <td>CSS class name for the type ahead heading element.</td>
        </tr>
        <tr>
            <td>$typeAhead-class-shadow</td>
            <td>.type-ahead-shadow</td>
            <td>CSS class name for the type ahead shadow text wrapper.</td>
        </tr>
        <tr>
            <td>$typeAhead-transition</td>
            <td>.3s</td>
            <td>The transition time for all type ahead animations.</td>
        </tr>
        <tr>
            <td>$typeAhead-zindex</td>
            <td>500</td>
            <td>The z-index for the type ahead element.</td>
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
            <td>builder</td>
            <td>function</td>
            <td></td>
            <td>The function to use for building menu items. Will fallback to <code>build()</code>.</td>
        </tr>
        <tr>
            <td>descTemplate</td>
            <td>string</td>
            <td>
                &lt;span class="type-ahead-desc"&gt;&lt;/span&gt;
            </td>
            <td>The list item description markup.</td>
        </tr>
        <tr>
            <td>headingTemplate</td>
            <td>string</td>
            <td>
                &lt;li class="type-ahead-heading"&gt;&lt;/li&gt;
            </td>
            <td>The heading markup for list items.</td>
        </tr>
        <tr>
            <td>highlightTemplate</td>
            <td>string</td>
            <td>
                &lt;mark class="type-ahead-highlight"&gt;&lt;/mark&gt;
            </td>
            <td>The highlighted term markup.</td>
        </tr>
        <tr>
            <td>itemLimit</td>
            <td>int</td>
            <td>15</td>
            <td>The max number of items to display in the type ahead drop down menu.</td>
        </tr>
        <tr>
            <td>matcher</td>
            <td>function</td>
            <td></td>
            <td>The function to use for matching results against the keyword. Will fallback to <code>match()</code>.</td>
        </tr>
        <tr>
            <td>minLength</td>
            <td>int</td>
            <td>1</td>
            <td>The minimum character count to trigger a lookup.</td>
        </tr>
        <tr>
            <td>prefetch</td>
            <td>bool</td>
            <td>false</td>
            <td>Whether to prefetch all data from <code>source</code> on initialization, instead of querying each lookup.</td>
        </tr>
        <tr>
            <td>query</td>
            <td>object</td>
            <td></td>
            <td>An object of key value pairs to include in the query string for AJAX requests.</td>
        </tr>
        <tr>
            <td>shadow</td>
            <td>bool</td>
            <td>false</td>
            <td>Whether to render shadow text below the input field for the 1st matching item in the menu.</td>
        </tr>
        <tr>
            <td>shadowTemplate</td>
            <td>string</td>
            <td>
                &lt;div class="type-ahead-shadow"&gt;&lt;/div&gt;
            </td>
            <td>The shadow input wrapping markup.</td>
        </tr>
        <tr>
            <td>sorter</td>
            <td>function</td>
            <td></td>
            <td>The function to use for sorting results. Will fallback to <code>sort()</code>.</td>
        </tr>
        <tr>
            <td>source</td>
            <td>array|string|function</td>
            <td></td>
            <td>The source data to match and sort against. Learn more about this option in the data source chapter.</td>
        </tr>
        <tr>
            <td>template</td>
            <td>string</td>
            <td>
                &lt;div class="type-ahead"&gt;&lt;/div&gt;
            </td>
            <td>The type ahead drop menu markup.</td>
        </tr>
        <tr>
            <td>titleTemplate</td>
            <td>string</td>
            <td>
                &lt;span class="type-ahead-title"&gt;&lt;/span&gt;
            </td>
            <td>The list item title markup.</td>
        </tr>
        <tr>
            <td>throttle</td>
            <td>int</td>
            <td>250</td>
            <td>The time in milliseconds to throttle lookup events.</td>
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
            <td>cycle</td>
            <td>object:item, int:index</td>
            <td>Triggered when cycling through the menu items using keyboard events.</td>
        </tr>
        <tr>
            <td>select</td>
            <td>object:item, int:index</td>
            <td>Triggered when an item is selected within the menu.</td>
        </tr>
        <tr>
            <td>reset</td>
            <td></td>
            <td>Triggered when the type ahead is reset, either when the keyword is cleared, or nothing is selected.</td>
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
            <td>cache</td>
            <td>object</td>
            <td>A cache of lookups indexed by the term used to query with.</td>
        </tr>
        <tr>
            <td>index</td>
            <td>int</td>
            <td>The current item index when cycling with keyboard events.</td>
        </tr>
        <tr>
            <td>input</td>
            <td>element</td>
            <td>The input element to monitor keyup events on. Is the input passed through the constructor.</td>
        </tr>
        <tr>
            <td>items</td>
            <td>array</td>
            <td>The list of data returned from <code>source</code>. This data will be sorted and matched against.</td>
        </tr>
        <tr>
            <td>shadow</td>
            <td>element</td>
            <td>The shadow text input element when <code>shadow</code> is enabled.</td>
        </tr>
        <tr>
            <td>term</td>
            <td>string</td>
            <td>The keyword from <code>input</code> to query with.</td>
        </tr>
        <tr>
            <td>wrapper</td>
            <td>element</td>
            <td>The element that wraps the inputs when <code>shadow</code> is enabled.</td>
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
            <td>build(object:item)</td>
            <td>
                Build the anchor link that will be rendered in the drop down menu.
                By default, will create an <code>a</code> tag with the title and description wrapped in <code>span</code>s.
            </td>
        </tr>
        <tr>
            <td>highlight(string:title)</td>
            <td>Highlight all occurrences of the <code>term</code> found within the item title.</td>
        </tr>
        <tr>
            <td>lookup(string:term)</td>
            <td>Trigger a lookup within the data source using the defined term. Results will be set to <code>items</code>.</td>
        </tr>
        <tr>
            <td>match(string:item, string:term)</td>
            <td>
                Return true if the item contains or matches the term.
                By default, will do a string <code>indexOf()</code> comparison.
            </td>
        </tr>
        <tr>
            <td>rewind()</td>
            <td>Rewind the index and cycle pointer to the start.</td>
        </tr>
        <tr>
            <td>sort(array:items)</td>
            <td>
                Sort the list of items before matching and processing.
                By default, will do an array <code>sort()</code> coupled with a string <code>localeCompare()</code>.
            </td>
        </tr>
        <tr>
            <td>source(array:data)</td>
            <td>
                Set the array of data as the list of items to query against.
                The data will be immediately sorted, matched, categorized, and processed.
            </td>
        </tr>
    </tbody>
</table>
