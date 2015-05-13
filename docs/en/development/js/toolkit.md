# Toolkit Object #

The global `Toolkit` object is used extensively by and created for the plugin system. It defines global options, localized messages, feature detection, and device support. It also acts as a namespace for plugins by housing a top level name to avoid global conflicts. Each plugin class definition can be found on the `Toolkit` object, for example, the accordion class is found under `Toolkit.Accordion`.

## Debugging ##

Debugging problems and solving issues can always be a headache, and because of this, Toolkit provides an easy low-level debugging system. When the debugger is enabled, all events triggered through `fireEvent()` will be logged to the console.

There are 2 ways to enable debugging. First, globally.

```javascript
Toolkit.debug = true;
```

Or passed individually to a plugin.

```javascript
$('.carousel').carousel({ debug: true });
```

<div class="notice is-info">
    Passing "verbose" instead of a boolean will log additional information to the console.
</div>

## Locale Messages ##

The following messages are used within AJAX calls and are found under `Toolkit.messages`. They are represented as an object allowing for easy localization, and can be modified similar to an options object.

<table class="table is-striped data-table">
    <thead>
        <tr>
            <th>Message</th>
            <th>Default</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>error</td>
            <td>An error has occurred!</td>
            <td>Message to display when an AJAX call has failed.</td>
        </tr>
        <tr>
            <td>loading</td>
            <td>Loading...</td>
            <td>Message to display while an AJAX request is loading.</td>
        </tr>
    </tbody>
</table>

```javascript
$.extend(Toolkit.messages, {
    loading: 'Wait a second!',
    error: 'Oops, it broke...'
});
```

## Feature Flags ##

The following flags are used for feature detection within plugins. Each flag can be found on the `Toolkit` object.

<table class="table is-striped data-table">
    <thead>
        <tr>
            <th>Flag</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>hasTransition</td>
            <td>Does the browser support CSS transitions?</td>
        </tr>
        <tr>
            <td>isTouch</td>
            <td>Does the device support touch capabilities?</td>
        </tr>
        <tr>
            <td>isRetina</td>
            <td>Does the device support HD / retina displays?</td>
        </tr>
        <tr>
            <td>isRTL</td>
            <td>Is the current language in right-to-left mode?</td>
        </tr>
        <tr>
            <td>transitionEnd</td>
            <td>The vendor prefixed name for the <code>transitionend</code> event.</td>
        </tr>
    </tbody>
</table>

```javascript
if (Toolkit.isTouch) {
    element.on('swipeleft', callback);
}
```

<div class="notice is-warning">
    Flags are determined automatically and should not be altered in any way!
</div>


## Methods ##

The following methods are available on the `Toolkit` object.

<table class="table is-striped data-table">
    <thead>
        <tr>
            <th>Method</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>bem(string:block[, string:element[, string:modifier]])</td>
            <td>
                Generate a BEM (block-element-modifier) valid CSS class name.
                Uses <code>Toolkit.bemSeparators</code> as separating characters.
            </td>
        </tr>
        <tr>
            <td>buildTemplate(mixed:template)</td>
            <td>Parse a value and convert it to a template string.</td>
        </tr>
        <tr>
            <td>createPlugin(string:name[, func:callback[, bool:collection]])</td>
            <td>
                Define a new jQuery plugin using the callback as a factory.
                If the plugin is meant for multiple elements at once, pass true as the 3rd argument.
            </td>
        </tr>
    </tbody>
</table>
