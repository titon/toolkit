# Blackout #

Blacks out the viewport while other components are being displayed.

## Usage ##

The blackout is a special kind of component in which a single instance should only exist. The implementation behind this is for situations where multiple components need to open a blackout at the same time (multiple modals, etc), but not display multiple overlapping blackout elements. A single blackout instance solves this problem by recording a count of how many times it has been opened, and decreases that count each time it is closed. The blackout element is shown on the 1st count, and hidden once the count reaches 0.

The blackout instance can be retrieved using the `instance()` method.

```javascript
var blackout = Toolkit.Blackout.instance();
    blackout.show();
```

<div class="notice is-info">
    For the most part, the blackout should rarely be interacted with manually. Components that integrate the blackout will handle situations accordingly.
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
            <td>$blackout-class</td>
            <td>.blackout</td>
            <td>CSS class name for the blackout element.</td>
        </tr>
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
        <tr>
            <td>$blackout-zindex</td>
            <td>600</td>
            <td>The z-index for the blackout element.</td>
        </tr>
    </tbody>
</table>

## Options ##

Since the blackout is a singleton, [options will need to be set globally](../development/js/base.md#options).

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
            <td>loaderTemplate</td>
            <td>string</td>
            <td>
                &lt;div class="loader bar-wave"&gt;<br>
                    &lt;span&gt;&lt;/span&gt;&lt;span&gt;&lt;/span&gt;&lt;span&gt;&lt;/span&gt;&lt;span&gt;&lt;/span&gt;&lt;span&gt;&lt;/span&gt;<br>
                    &lt;div class="loader-message" data-loader-message&gt;&lt;/div&gt;<br>
                &lt;/div&gt;
            </td>
            <td>The loader markup to be inserted into the blackout.</td>
        </tr>
        <tr>
            <td>showLoading</td>
            <td>bool</td>
            <td>true</td>
            <td>If true, will insert <code>Toolkit.messages.loading</code> into the <code>[data-loader-message]</code> element.</td>
        </tr>
        <tr>
            <td>template</td>
            <td>string</td>
            <td>
                &lt;div class="blackout"&gt;&lt;/div&gt;
            </td>
            <td>The blackout markup.</td>
        </tr>
        <tr>
            <td>templateFrom</td>
            <td>string</td>
            <td>#toolkit-blackout-1</td>
            <td>The ID of an element to use as the template.</td>
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
            <td>hiding</td>
            <td></td>
            <td>Triggered before the blackout is hidden.</td>
        </tr>
        <tr>
            <td>hidden</td>
            <td>bool:hidden</td>
            <td>
                Triggered after the blackout is hidden (may not actually conceal it).
                The <code>hidden</code> argument determines when the blackout is visually hidden,
                instead of simply decreasing its display count.
            </td>
        </tr>
        <tr>
            <td>showing</td>
            <td></td>
            <td>Triggered before the blackout is shown.</td>
        </tr>
        <tr>
            <td>shown</td>
            <td>bool:shown</td>
            <td>
                Triggered after the blackout is shown (may not actually reveal it).
                The <code>shown</code> argument determines when the blackout is visually shown,
                instead of simply increasing its display count.
            </td>
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
            <td>count</td>
            <td>int</td>
            <td>
                A count of many times the blackout has been opened by components.
                Determines whether to show or hide the element.
            </td>
            <td></td>
        </tr>
        <tr>
            <td>loader</td>
            <td>element</td>
            <td>The loading animation element.</td>
            <td></td>
        </tr>
        <tr>
            <td>message</td>
            <td>element</td>
            <td>The loading message element located within the loader element.</td>
            <td>[data-loader-message]</td>
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
            <td>hideLoader()</td>
            <td>Hide the loader element.</td>
        </tr>
        <tr>
            <td>showLoader()</td>
            <td>Show the loader element.</td>
        </tr>
    </tbody>
</table>
