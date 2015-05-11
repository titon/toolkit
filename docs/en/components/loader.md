# Loader #

Animated Loaders and spinners used for processing and loading states.

## Usage ##

In the past, loading animations have been built using animated GIFs, or through JavaScript timers, both of which are outdated. Take advantage of GPU rendering through CSS animations with these beautifully designed CSS loaders. Perfect for AJAX loading states.

### Waves ###

There are 2 types of wave animations, a bar wave and a bubble wave. The bar wave is a set of solid vertical bars that fluctuate in size in a horizontal manner.

```html
<div class="loader bar-wave">
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>

    <!-- Message is optional -->
    <div class="loader-message">
        Loading...
    </div>
</div>
```

The bubble wave is similar to a bar wave, with the only difference being the bars are circle shaped.

```html
<div class="loader bubble-wave">
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>

    <!-- Message is optional -->
    <div class="loader-message">
        Loading...
    </div>
</div>
```

<div class="notice is-info">
    Each <code>span</code> in the examples above represent an individual bar or bubble. By default, animations will only occur for <code>span</code>s up to 5. To increase or decrease this number, modify the <code>$loader-wave-count</code> Sass variable.
</div>

### Spinners ###

There is currently only 1 type of spinner, a bubble spinner. A bubble spinner is a set of 8 bubbles that fluctuate in a clockwise manner.

```html
<div class="loader bubble-spinner">
    <div class="loader-spinner">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
    </div>

    <!-- Message is optional -->
    <div class="loader-message">
        Loading...
    </div>
</div>
```

<div class="notice is-warning">
    All 8 <code>span</code>s are required for the bubble spinner.
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
            <td>$loader-bar-height</td>
            <td>2.5rem</td>
            <td>The height of a bar.</td>
        </tr>
        <tr>
            <td>$loader-bar-width</td>
            <td>0.65rem</td>
            <td>The width of a bar.</td>
        </tr>
        <tr>
            <td>$loader-bubble-size</td>
            <td>1.5rem</td>
            <td>The radius of a bubble.</td>
        </tr>
        <tr>
            <td>$loader-class</td>
            <td>.loader</td>
            <td>CSS class name for the loader wrapper.</td>
        </tr>
        <tr>
            <td>$loader-class-message</td>
            <td>.loader-message</td>
            <td>CSS class name for the loader message.</td>
        </tr>
        <tr>
            <td>$loader-class-spinner</td>
            <td>.loader-spinner</td>
            <td>CSS class name for the loader spinner wrapper.</td>
        </tr>
        <tr>
            <td>$loader-color</td>
            <td>#000</td>
            <td>The color of the bars and bubbles.</td>
        </tr>
        <tr>
            <td>$loader-type</td>
            <td>all</td>
            <td>The type of loader to include in the CSS output. Accepts all, bar-wave, bubble-wave, and bubble-spinner.</td>
        </tr>
        <tr>
            <td>$loader-wave-count</td>
            <td>5</td>
            <td>The number of items in a wave to generate animations for.</td>
        </tr>
    </tbody>
</table>
