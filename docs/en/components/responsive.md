# Responsive #

Responsive classes for mobile, tablet and desktop resolutions.

## Usage ##

For easier mobile and tablet development, a handful of utility classes are available for showing and hiding content based on media queries and breakpoints. These classes should be used to complement a layout, not for structuring it.

### Display Classes ###

Use these for toggling content based on the viewport width.

<table class="table is-striped data-table">
    <thead>
        <tr>
            <th> </th>
            <th>Extra Small (0px-640px)</th>
            <th>Small (641px-960px)</th>
            <th>Medium (961px-1280px)</th>
            <th>Large (1281px-1680px)</th>
            <th>Extra Large (1680px+)</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>.hide-xsmall</td>
            <td>Hidden</td>
            <td class="is-success">Visible</td>
            <td class="is-success">Visible</td>
            <td class="is-success">Visible</td>
            <td class="is-success">Visible</td>
        </tr>
        <tr>
            <td>.hide-small</td>
            <td class="is-success">Visible</td>
            <td>Hidden</td>
            <td class="is-success">Visible</td>
            <td class="is-success">Visible</td>
            <td class="is-success">Visible</td>
        </tr>
        <tr>
            <td>.hide-medium</td>
            <td class="is-success">Visible</td>
            <td class="is-success">Visible</td>
            <td>Hidden</td>
            <td class="is-success">Visible</td>
            <td class="is-success">Visible</td>
        </tr>
        <tr>
            <td>.hide-large</td>
            <td class="is-success">Visible</td>
            <td class="is-success">Visible</td>
            <td class="is-success">Visible</td>
            <td>Hidden</td>
            <td class="is-success">Visible</td>
        </tr>
        <tr>
            <td>.hide-xlarge</td>
            <td class="is-success">Visible</td>
            <td class="is-success">Visible</td>
            <td class="is-success">Visible</td>
            <td class="is-success">Visible</td>
            <td>Hidden</td>
        </tr>
        <tr class="table-divider">
            <td colspan="6"></td>
        </tr>
        <tr>
            <td>.show-xsmall</td>
            <td class="is-success">Visible</td>
            <td>Hidden</td>
            <td>Hidden</td>
            <td>Hidden</td>
            <td>Hidden</td>
        </tr>
        <tr>
            <td>.show-small</td>
            <td>Hidden</td>
            <td class="is-success">Visible</td>
            <td>Hidden</td>
            <td>Hidden</td>
            <td>Hidden</td>
        </tr>
        <tr>
            <td>.show-medium</td>
            <td>Hidden</td>
            <td>Hidden</td>
            <td class="is-success">Visible</td>
            <td>Hidden</td>
            <td>Hidden</td>
        </tr>
        <tr>
            <td>.show-large</td>
            <td>Hidden</td>
            <td>Hidden</td>
            <td>Hidden</td>
            <td class="is-success">Visible</td>
            <td>Hidden</td>
        </tr>
        <tr>
            <td>.show-xlarge</td>
            <td>Hidden</td>
            <td>Hidden</td>
            <td>Hidden</td>
            <td>Hidden</td>
            <td class="is-success">Visible</td>
        </tr>
    </tbody>
</table>

<div class="notice is-info">
    The breakpoints for these responsive display classes can be altered through the <code>$breakpoint-range-*</code> Sass variables.
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
            <td>.hide-landscape</td>
            <td class="is-success">Visible</td>
            <td>Hidden</td>
        </tr>
        <tr>
            <td>.hide-portrait</td>
            <td>Hidden</td>
            <td class="is-success">Visible</td>
        </tr>
        <tr>
            <td>.show-landscape</td>
            <td>Hidden</td>
            <td class="is-success">Visible</td>
        </tr>
        <tr>
            <td>.show-portrait</td>
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
            <td>.hide-retina</td>
            <td class="is-success">Visible</td>
            <td>Hidden</td>
        </tr>
        <tr>
            <td>.show-retina</td>
            <td>Hidden</td>
            <td class="is-success">Visible</td>
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
            <td>.hide-print</td>
            <td class="is-success">Visible</td>
            <td>Hidden</td>
        </tr>
        <tr>
            <td>.show-print</td>
            <td>Hidden</td>
            <td class="is-success">Visible</td>
        </tr>
    </tbody>
</table>

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
            <td>$responsive-design</td>
            <td>mobile</td>
            <td>
                Determines which type of device to target; accepts <code>mobile</code> or <code>desktop</code>.
                If <code>mobile</code> is used, responsive mixins will use <code>min-width</code> breakpoints in media queries.
                If <code>desktop</code> is used, then <code>max-width</code> breakpoints are used.
            </td>
        </tr>
    </tbody>
</table>
