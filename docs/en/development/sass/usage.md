# Usage #

A handful of techniques on using Sass within Toolkit properly.

## Unit Conversion ##

Converting between unit types in Sass is rather complex and tedious as too many external variables are involved. To save everyone time, we took the grunt of the work and implemented a system for converting between unit types. The following units of measurement are supported: `px`, `em`, `rem`, and `%`.

Conversion is split into the following functions, `to-pixel($from)`, `to-percent($from)`, `to-rem($from)`, and `to-em($from)`, with all functions accepting a single argument &mdash; the unit measurement to convert from.

```scss
$base-size: 16px; // 16px = 1, 1600px = 100

to-pixel(3rem); // 48px
to-percent(550px); // 34%
to-rem(52%); // 52rem
to-em(123px); // 7.6em
```

When calculating the above &ndash; `16px`, `1%`, `1rem`, and `1em` are equivalent &ndash; so use accordingly. The primary focus of these functions is to calculate correctly scaled widths for grids.

Another useful function is `strip-unit(value)`, which will remove the unit of measurement and return the literal number. This function is used heavily in the other conversion functions.

```scss
strip-unit(15px); // 15
```

## Media Queries & Responsiveness ##

Responsive design is the way of the future, as it allows a single website to render differently across multiple devices and resolutions. Because Toolkit follows the mobile first and responsive design philosophies, many features have been developed to aid in the implementation of responsive websites.

The first of which is cascading inheritance through media queries &mdash; the foundation for mobile first design. The concept behind this pattern is that CSS (or Sass) should be initially written for mobile devices, and any additional styles should be inherited for larger devices through media queries. This improves mobile rendering speeds as the lowest amount of CSS properties are being used. When using this approach, the `$responsive-design` variable should be set to `mobile`.

Let's now see this approach in action by creating a unordered list that displays vertically in mobile, and horizontally in larger devices.

```scss
// Menu should stack vertically by default
.menu {
    @include reset-list;

    a {
        display: block;
        padding: .5rem 1rem;
    }
}

// Render horizontally in medium sized devices and above
@include if-medium() {
    .menu {
        @include clear-fix;

        li { float: left; }
    }
}

// Increase the link sizes in large devices and above
@include if-large() {
    .menu a {
        padding: 1rem 2rem;
    }
}
```

<div class="notice is-info">
    If you prefer doing the reverse and implementing desktop first, be sure to set <code>$responsive-design</code> to <code>desktop</code>, and swapping the mixins that are used.
</div>

We can also swap images for high resolution devices.

```scss
.icon {
    background: url('/img/icon.png') no-repeat;
    background-size: 16px 16px;

    // Use a 32x32 icon for retina displays
    @include if-retina() {
        background-image: url('/img/icon@2x.png');
    }
}
```

Or toggle the display of an element depending on device orientation.

```scss
.hero {
    width: 100%;
    height: auto;

    // 4x3 in portrait
    @include if-portrait() {
        padding-bottom: 75%;
    }

    // 16x9 in landscape
    @include if-landscape() {
        padding-bottom: 56.25%
    }
}
```

For greater compatibility, the [Responsive component](../../components/responsive.md) provides a handful of helper classes, so be sure to check those out as well!

## Grid Building ##

Even though Toolkit comes bundled with a robust responsive [Grid component](../../components/grid.md), there may be instances where you want to create your own grids. This is entirely possible using Toolkit's grid functions and mixins.

Let's make use of the grid helpers to structure a list with 5 items that should be evenly spaced out. The first thing we need to do is create the wrapper with `grid-row()`, and the column with `grid-column()`.

```scss
.block-grid {
    @include reset-list;
    @include grid-row(500px); // 500px wide

    li {
        @include grid-column(500px, 20px); // 20px gutter
    }
}
```

Now that we have the basic structure, we need to add the widths for each of the 5 items. We can accomplish this by calling `grid-span()` and supplying the column count, grid width, and gutter size.

```scss
.block-grid li {
    // Get the width for 1 column out of 5 with a 20px gutter
    width: grid-span(1, 5, 500px, 20px);
}
```
