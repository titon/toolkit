# Philosophies #

The major philosophies and design decisions behind Toolkit's CSS.

## Normalize Integration ##

Toolkit makes use of [normalize.css](http://necolas.github.io/normalize.css) as a means to standardize implementations across browsers.

The primary [CSS distribution file](../../setup/getting-started.md#distribution-files) has Normalize included automatically as the first declaration. The Normalize source code can also be found in the [source folder](../../setup/getting-started.md#source-files) allowing for easier integration.

Normalize inclusion can also be toggled when [generating custom builds](../../setup/custom-builds.md#normalize-integration).

## Mobile First ##

To ensure support and adoption on a wide array of devices, Toolkit follows a mobile first design philosophy. This designates mobile devices as first class priority, with CSS and JavaScript focused for mobile first. Additional functionality for larger screens will only be loaded through use of media queries.

To ensure proper viewport rendering and touch capabilities on mobile devices, add the appropriate viewport meta tag to `<head>`.

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
```

## Fluid & Responsiveness ##

Being mobile friendly and being responsive go hand in hand. To further support this philosophy, all plugins (especially the grid) make use of fluid layouts, ala percentages for widths. This allows plugins to scale and reposition automatically based on the device viewport &mdash; which in turn, reduces the codebase.

Responsive websites require media query support within the browser &mdash; [the following browsers are supported](../../support/compatibility.md).
