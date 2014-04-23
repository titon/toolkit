# Extensions #

Why stop at components? Why not extend jQuery and MooTools directly with new functionality?
Well don't worry, that's exactly what Toolkit has done.
We extended the prototype of each vendor with new functionality that eased component development.
These extensions may even solve a problem in your own codebase.

<table class="table is-striped data-table">
    <thead>
        <tr>
            <th>Extension</th>
            <th>Vendor</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr class="table-divider">
            <td colspan="3">Methods</td>
        </tr>
        <tr>
            <td>toolkit(string:component[, string:method[, array:args]])</td>
            <td>Both</td>
            <td>
                Return a component instance if one has been initialized on this element.
                If a method is defined, trigger the method on the instance and pass the arguments.
            </td>
        </tr>
        <tr>
            <td>reveal()</td>
            <td>Both</td>
            <td>
                Show an element by replacing <code>.hide</code> with <code>.show</code>.
                Will trigger any animations or transitions.
            </td>
        </tr>
        <tr>
            <td>conceal()</td>
            <td>Both</td>
            <td>
                Hide an element by replacing <code>.show</code> with <code>.hide</code>.
                Will trigger any animations or transitions.
            </td>
        </tr>
        <tr>
            <td>positionTo(string:position, element|event:relativeTo[, object:baseOffset[, bool:isMouse]])</td>
            <td>Both</td>
            <td>
                Position the element relative to another element.
                <code>position</code> may be any combination of top, bottom, left, right, and center, in dashed format.
                <code>relativeTo</code> may either be an element or event (used with <code>isMouse</code> for mouse following).
                <code>baseOffset</code> may be an object with default left and top values.
                When set to true, <code>isMouse</code> will re-position the element based on mouse cursor dimensions.
                If the element falls outside of the viewport, it will be re-positioned by altering the position class name.
            </td>
        </tr>
        <tr>
            <td>is(':shown')</td>
            <td>jQuery</td>
            <td rowspan="2">
                Determines whether an element is visible or not by checking that <code>visibility</code> is not equal to hidden.
                Is used in conjunction with <code>conceal()</code> and <code>reveal()</code> for animating.
            </td>
        </tr>
        <tr>
            <td>isShown()</td>
            <td>MooTools</td>
        </tr>
        <tr>
            <td>i(int:index)<br> item(int:index)</td>
            <td>jQuery</td>
            <td>
                Return a jQuery wrapped value from the current jQuery collection defined by the index number.
                This is equivalent to <code>$($('.query')[0])</code> or <code>$($('.query').get(0))</code>.
            </td>
        </tr>
        <tr>
            <td>addData(string:key, mixed:value)</td>
            <td>jQuery</td>
            <td>
                Set data if the key does not exist, else return the current value.
                This is a combination of getting and setting internal jQuery data.
            </td>
        </tr>
        <tr>
            <td>aria(string:key, mixed:value)</td>
            <td>Both</td>
            <td>
                Sets ARIA attributes on the target element.
                Can also accept an object of key value pairs.
            </td>
        </tr>

        <tr class="table-divider">
            <td colspan="3">Functions</td>
        </tr>
        <tr>
            <td>jQuery.debounce(func:func[, int:threshold[, bool:immediate]])</td>
            <td>jQuery</td>
            <td rowspan="2">
                Delays the execution of a function until the duration has completed.
            </td>
        </tr>
        <tr>
            <td>Function.prototype.debounce([int:threshold[, bool:immediate]])</td>
            <td>MooTools</td>
        </tr>
        <tr>
            <td>jQuery.throttle(func:func[, int:delay[, array:args]])</td>
            <td>jQuery</td>
            <td>
                Throttle the execution of a function so it triggers at every delay interval.
            </td>
        </tr>
        <tr>
            <td>jQuery.bound(int:value, int:max[, int:min])</td>
            <td>jQuery</td>
            <td rowspan="2">Bound a number between a min and max range.</td>
        </tr>
        <tr>
            <td>Number.prototype.bound(int:value, int:max[, int:min])</td>
            <td>MooTools</td>
        </tr>
        <tr>
            <td>jQuery.cookie(string:key, mixed:value[, object:options])</td>
            <td>jQuery</td>
            <td>Set a cookie with a value. Can define optional settings.</td>
        </tr>
        <tr>
            <td>jQuery.removeCookie(string:key[, object:options])</td>
            <td>jQuery</td>
            <td>Remove a cookie defined by key.</td>
        </tr>
        <tr>
            <td>Array.prototype.chunk(int:size)</td>
            <td>MooTools</td>
            <td>
                Split an array into multiple chunked arrays.
            </td>
        </tr>
        <tr>
            <td>Function.prototype.bind(func:func)</td>
            <td>jQuery</td>
            <td>
                Alters the <code>this</code> context of bound functions.
                A polyfill for ECMA5 functionality.
            </td>
        </tr>

        <tr class="table-divider">
            <td colspan="3">Events</td>
        </tr>
        <tr>
            <td>clickout</td>
            <td>Both</td>
            <td>
                A custom event that triggers when a click occurs outside the element that has been bound.
                Is used by drop downs, dialogs, modals, etc.
            </td>
        </tr>
        <tr>
            <td>swipe, swipeleft, swiperight, swipeup, swipedown</td>
            <td>jQuery</td>
            <td>
                Custom events that emulate swiping on touch devices. If the device is non-touch,
                standard mouse events are used instead.
            </td>
        </tr>
    </tbody>
</table>