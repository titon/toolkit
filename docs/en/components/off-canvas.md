# Off Canvas #

Contextual sidebars positioned outside the viewport until activated.

## Usage ##


### Custom Widths ###

By default, the sidebar is 20% width of the viewport. To use a fixed width, or to change the percentage,
a few CSS classes will need to be modified.

* First, set the width of the sidebar on the modifier.
* Then set a negative margin of the same amount. The negative side should equate to the location of the sidebar.
* Lastly, set the side padding of the same amount on the opposite container `push-*` class.

```css
// Left sidebar
.off-canvas--left { width: 200px; margin-left: -200px; }
.off-canvas-container.push-right { padding-left: 200px; }

// Right sidebar
.off-canvas--right { width: 15%; margin-right: -15%; }
.off-canvas-container.push-left { padding-right: 15%; }
```

<div class="notice is-info">
    Sass <code>$offCanvas-left-width</code> and <code>$offCanvas-right-width</code> variables
    can also be modified to alter these widths.
</div>

### Notes ###

* Do not use `conceal()` on the sidebar element as it breaks transitions.
* When a sidebar is open, the container will have a `.push-*` class added (only if `overlay` is disabled).

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
            <td>$offCanvas-left-width</td>
            <td>20%</td>
            <td>The width of the left sidebar, and the amount of padding or margin to slide with.</td>
        </tr>
        <tr>
            <td>$offCanvas-right-width</td>
            <td>20%</td>
            <td>The width of the right sidebar, and the amount of padding or margin to slide with.</td>
        </tr>
        <tr>
            <td>$offCanvas-transition</td>
            <td>.5s</td>
            <td>The transition time for sidebar slide animations.</td>
        </tr>
        <tr>
            <td>$offCanvas-zindex</td>
            <td>250</td>
            <td>The z-index for the sidebar element.</td>
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
            <td>selector</td>
            <td>string</td>
            <td></td>
            <td>
                CSS selector to bind click toggle events to.
                This toggle event will open and close the sidebar.
            </td>
        </tr>
        <tr>
            <td>overlay</td>
            <td>bool</td>
            <td>false</td>
            <td>Will display the sidebar over the content, instead of pushing the content.</td>
        </tr>
        <tr>
            <td>openOnLoad</td>
            <td>bool</td>
            <td>false</td>
            <td>
                Will automatically display the sidebar on page load.
                Transitions will not be triggered during this.
            </td>
        </tr>
        <tr>
            <td>hideOthers</td>
            <td>bool</td>
            <td>true</td>
            <td>Will hide all other sidebars when opening a sidebar.</td>
        </tr>
    </tbody>
</table>

## Events ##

Inherits all events from the [parent component](../development/js.md#events).

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
            <td>container</td>
            <td>element</td>
            <td>The parent element that contains the sidebar. Is usually the body.</td>
        </tr>
        <tr>
            <td>side</td>
            <td>string</td>
            <td>The side where the sidebar is positioned. Will either be left or right.</td>
        </tr>
        <tr>
            <td>opposite</td>
            <td>string</td>
            <td>
                The opposite of <code>side</code>.
                Is used for setting <code>push-*</code> classes on the container.
            </td>
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
            <td>toggle()</td>
            <td>
                Toggle the display of the sidebar.
                This method is triggered automatically through click events when <code>selector</code> is defined.
            </td>
        </tr>
    </tbody>
</table>
