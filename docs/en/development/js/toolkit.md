# Toolkit Namespace #

The global `Toolkit` object is used extensively by and created for the plugin system.
It defines global options, localized messages, feature detection, and device support.
It also acts as a namespace for plugins by housing a top level name to avoid global conflicts.
Each plugin class definition can be found on the `Toolkit` object, for example,
the accordion class is found under `Toolkit.Accordion`.

## Vendor Prefix ##

Paired with the [Sass `$vendor-prefix` variable](../sass/variables.md), the `Toolkit.vendor` can be defined for
prefixing within the JavaScript layer. This value will be prepended to all component class names that are
embedded in templates and created with JavaScript.

```javascript
Toolkit.vendor = 'tk-';
```

## ARIA Support ##

[ARIA](http://www.w3.org/TR/wai-aria/) is enabled by default for all applicable plugins.
What this involves is automatic ARIA attribute inclusion and generation for JavaScript modules.
To disable ARIA support, set the `Toolkit.aria` property to false.

```javascript
Toolkit.aria = false;
```

<div class="notice is-warning">
    Disabling ARIA also disables the <code>aria()</code> method.
</div>

## Debugging ##

Debugging problems and solving issues can always be a headache, and because of this,
Toolkit provides an easy low-level debugging system. When the debugger is enabled,
all events triggered through `fireEvent()` will be logged to the console.

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

The following messages are used within AJAX calls and are found under `Toolkit.messages`.
They are represented as an object allowing for easy localization, and can be modified similar to an options object.

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

The following flags are used for feature detection within plugins.
Each flag can be found on the `Toolkit` object.

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
            <td>transitionEnd</td>
            <td>The correct vendor prefixed name for the <code>transitionend</code> event.</td>
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