# Blackout #

Blacks out the viewport while other components are being displayed.

## Usage ##

The blackout is a special kind of component in which a single instance should only exist.
The implementation behind this is for situations where multiple components need to open a blackout at
the same time (multiple modals, etc), but not display multiple overlapping blackout elements.
A single blackout instance solves this problem by recording a count of how many times it has been opened,
and decreases that count each time it is closed. The blackout element is shown on the 1st count, and
hidden once the count reaches 0.

The blackout instance can be retrieved using the `factory()` method.

```javascript
var blackout = Toolkit.Blackout.factory();
    blackout.show();
```

For the most part, the blackout should rarely be interacted with manually.
Components that integrate the blackout will handle situations accordingly.

## Variables ##

<table class="table data-table">
    <thead>
        <tr>
            <th>Variable</th>
            <th>Default</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>$blackout-opacity</td>
            <td>0.85</td>
            <td>The alpha transparency for the blackout element.</td>
        </tr>
        <tr>
            <td>$blackout-transition</td>
            <td>.3s</td>
            <td>The transition time for fading in and out.</td>
        </tr>
    </tbody>
</table>

## Options ##

Since the blackout is a singleton, [options will need to be set globally](../development/js.md#options).

<table class="table data-table">
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
            <td>loader</td>
            <td>string</td>
            <td>bar-wave</td>
            <td>
                The type of animation to use while other components are loading.
                The value must equate to a class name from the <code>Loader</code> component.
            </td>
        </tr>
        <tr>
            <td>waveCount</td>
            <td>int</td>
            <td>5</td>
            <td>
                The number of bars or bubbles to use in the loading animation.
                If the value is more than 5, the Sass will have to be customized.
            </td>
        </tr>
        <tr>
            <td>templateFrom</td>
            <td>string</td>
            <td>#toolkit-blackout</td>
            <td>The ID of an element to use as the template.</td>
        </tr>
    </tbody>
</table>

## Template ##

The following markup is used for the creation of the blackout element.
This structure can be customized through the `template` option.

```html
<div class="{vendor}blackout" id="toolkit-blackout"></div>
```

The `{vendor}` value will be replaced with `Toolkit.options.vendor`.

## Events ##

Inherits all events from the [parent component](../development/js.md#events).

<table class="table data-table">
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
            <td>onHide</td>
            <td>hide.toolkit.blackout</td>
            <td>bool:hidden</td>
            <td>
                Triggered when the <code>hide()</code> method is called.
                The <code>hidden</code> argument determines when the blackout is visually hidden,
                instead of simply decreasing its display count.
            </td>
        </tr>
        <tr>
            <td>onHideLoader</td>
            <td>hideLoader.toolkit.blackout</td>
            <td></td>
            <td>Triggered when the <code>hideLoader()</code> method is called and the loader is hidden.</td>
        </tr>
        <tr>
            <td>onShow</td>
            <td>show.toolkit.blackout</td>
            <td>bool:shown</td>
            <td>
                Triggered when the <code>show()</code> method is called.
                The <code>shown</code> argument determines when the blackout is visually shown,
                instead of simply increasing its display count.
            </td>
        </tr>
        <tr>
            <td>onShowLoader</td>
            <td>showLoader.toolkit.blackout</td>
            <td></td>
            <td>Triggered when the <code>showLoader()</code> method is called and the loader is shown.</td>
        </tr>
    </tbody>
</table>

## Properties ##

Inherits all properties from the [parent component](../development/js.md#properties).

<table class="table data-table">
    <thead>
        <tr>
            <th>Property</th>
            <th>Type</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>count</td>
            <td>int</td>
            <td>
                A count of many times the blackout has been opened by components.
                Determines whether to show or hide the element.
            </td>
        </tr>
        <tr>
            <td>loader</td>
            <td>element</td>
            <td>The loading animation element that's based off the <code>Loader</code> component.</td>
        </tr>
        <tr>
            <td>message</td>
            <td>element</td>
            <td>The loading message element located within the loader element.</td>
        </tr>
    </tbody>
</table>

## Methods ##

Inherits all methods from the [parent component](../development/js.md#methods).

<table class="table data-table">
    <thead>
        <tr>
            <th>Method</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>hideLoader()</td>
            <td>Hide the loader element.</td>
        </tr>
        <tr>
            <td>showLoader()</td>
            <td>Show the loader element.</td>
        </tr>
    </tbody>
</table>