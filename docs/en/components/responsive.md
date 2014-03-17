# Responsive #

Responsive classes for mobile, tablet and desktop resolutions.

## Usage ##

For easier mobile and tablet development, a handful of utility classes are available
for showing and hiding content based on media queries and breakpoints.
These classes should be used to complement a layout, not for structuring it.

On top of the responsive classes mentioned above (and displayed below), a `.fluid`
class can be applied to `img`, `video`, `canvas`, and other block elements.
This fluid class will apply a `max-width` of 100% with auto-scaling heights.
Very useful for responsive designs!

```html
<img src="/img/large.png" class="fluid" alt="">
```

### Display Classes ###

Use these for toggling content based on the viewport width.

<table class="table is-striped data-table">
    <thead>
        <tr>
            <th> </th>
            <th>Small Devices (0px-768px)</th>
            <th>Medium Devices (769px-1280px)</th>
            <th>Large Devices (1280px+)</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>.show-small</td>
            <td class="is-success">Visible</td>
            <td>Hidden</td>
            <td>Hidden</td>
        </tr>
        <tr>
            <td>.show-medium</td>
            <td>Hidden</td>
            <td class="is-success">Visible</td>
            <td>Hidden</td>
        </tr>
        <tr>
            <td>.show-large</td>
            <td>Hidden</td>
            <td>Hidden</td>
            <td class="is-success">Visible</td>
        </tr>
        <tr>
            <td>.hide-small</td>
            <td>Hidden</td>
            <td class="is-success">Visible</td>
            <td class="is-success">Visible</td>
        </tr>
        <tr>
            <td>.hide-medium</td>
            <td class="is-success">Visible</td>
            <td>Hidden</td>
            <td class="is-success">Visible</td>
        </tr>
        <tr>
            <td>.hide-large</td>
            <td class="is-success">Visible</td>
            <td class="is-success">Visible</td>
            <td>Hidden</td>
        </tr>
    </tbody>
</table>

<table class="table is-striped data-table">
    <thead>
        <tr>
            <th> </th>
            <th>Mobile Devices (0px-480px)</th>
            <th>Tablet Devices (481px-1024px)</th>
            <th>Desktop Devices (1024px+)</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>.show-mobile</td>
            <td class="is-success">Visible</td>
            <td>Hidden</td>
            <td>Hidden</td>
        </tr>
        <tr>
            <td>.show-tablet</td>
            <td>Hidden</td>
            <td class="is-success">Visible</td>
            <td>Hidden</td>
        </tr>
        <tr>
            <td>.show-desktop</td>
            <td>Hidden</td>
            <td>Hidden</td>
            <td class="is-success">Visible</td>
        </tr>
        <tr>
            <td>.hide-mobile</td>
            <td>Hidden</td>
            <td class="is-success">Visible</td>
            <td class="is-success">Visible</td>
        </tr>
        <tr>
            <td>.hide-tablet</td>
            <td class="is-success">Visible</td>
            <td>Hidden</td>
            <td class="is-success">Visible</td>
        </tr>
        <tr>
            <td>.hide-desktop</td>
            <td class="is-success">Visible</td>
            <td class="is-success">Visible</td>
            <td>Hidden</td>
        </tr>
    </tbody>
</table>

<div class="notice is-info">
    The breakpoints for these responsive display classes
    can be altered through the <code>$breakpoint</code> Sass variables.
</div>

### Orientation Classes ###

Use these for toggling content based on device orientation.

<table class="table is-striped data-table">
    <thead>
        <tr>
            <th> </th>
            <th>Portrait</th>
            <th>Landscape</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>.show-portrait</td>
            <td class="is-success">Visible</td>
            <td>Hidden</td>
        </tr>
        <tr>
            <td>.show-landscape</td>
            <td>Hidden</td>
            <td class="is-success">Visible</td>
        </tr>
        <tr>
            <td>.hide-portrait</td>
            <td>Hidden</td>
            <td class="is-success">Visible</td>
        </tr>
        <tr>
            <td>.hide-landscape</td>
            <td class="is-success">Visible</td>
            <td>Hidden</td>
        </tr>
    </tbody>
</table>

### Retina Classes ###

Use these for toggling content based on screen quality (retina and HD displays).

<table class="table is-striped data-table">
    <thead>
        <tr>
            <th> </th>
            <th>Standard-Def (SD)</th>
            <th>High-Def (HD)</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>.show-retina</td>
            <td>Hidden</td>
            <td class="is-success">Visible</td>
        </tr>
        <tr>
            <td>.hide-retina</td>
            <td class="is-success">Visible</td>
            <td>Hidden</td>
        </tr>
    </tbody>
</table>

### Print Classes ###

Use these for toggling content for print.

<table class="table is-striped data-table">
    <thead>
        <tr>
            <th> </th>
            <th>Browser</th>
            <th>Print</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>.show-print</td>
            <td>Hidden</td>
            <td class="is-success">Visible</td>
        </tr>
        <tr>
            <td>.hide-print</td>
            <td class="is-success">Visible</td>
            <td>Hidden</td>
        </tr>
    </tbody>
</table>